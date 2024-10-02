import {
  ArcRotateCamera,
  ArcRotateCameraPointersInput,
  Camera,
  Color4,
  Engine,
  GaussianSplattingMesh,
  Mesh,
  MeshBuilder,
  Nullable,
  PointerEventTypes,
  Scene,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { App, getApp } from '../app'
import { GeodeticPosition, GeoManager } from '../cesium/geoManager'
import { ICameraController } from './iCameraController'
import {
  createScreenSpaceCamera,
  updateScreenSpaceCameraSize,
} from './screenSpaceCamera'
import { KeyboardCameraPointersInput } from './keyboardCameraPointersInput'

type FrameTiming = 'beforeRender' | 'afterRender'

// Ideally, the camera's position: Vector3 and rotation: Quaternion should be stored,
// but the rotation quaternion cloud not be obtained.
type CameraPose = {
  position: { x: number; y: number; z: number }
  target: { x: number; y: number; z: number }
}

const isCameraPose = (a: any): a is CameraPose => {
  return (
    a !== null &&
    typeof a === 'object' &&
    a.position !== null &&
    typeof a.position === 'object' &&
    a.target !== null &&
    typeof a.target === 'object' &&
    typeof a.position.x === 'number' &&
    typeof a.position.y === 'number' &&
    typeof a.position.z === 'number' &&
    typeof a.target.x === 'number' &&
    typeof a.target.y === 'number' &&
    typeof a.target.z === 'number'
  )
}

type GeodeticCameraPose = {
  position: GeodeticPosition
  target: GeodeticPosition
}

const isGeodeticCameraPose = (a: any): a is GeodeticCameraPose => {
  return (
    a !== null &&
    typeof a === 'object' &&
    a.position !== null &&
    typeof a.position === 'object' &&
    a.target !== null &&
    typeof a.target === 'object' &&
    typeof a.position.latitude === 'number' &&
    typeof a.position.longitude === 'number' &&
    typeof a.position.ellipsoidalHeight === 'number' &&
    typeof a.target.latitude === 'number' &&
    typeof a.target.longitude === 'number' &&
    typeof a.target.ellipsoidalHeight === 'number'
  )
}

const CameraPoseStorageKeyPrefix = 'spirareCameraPose'

const saveBabylonCameraPose = (
  pomlId: string,
  camera: ArcRotateCamera
): void => {
  const pose: CameraPose = {
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: camera.target.x,
      y: camera.target.y,
      z: camera.target.z,
    },
  }
  saveCameraPose(pomlId, pose)
}

const saveGeodeticCameraPose = (
  pomlId: string,
  cameraPosition: GeodeticPosition,
  cameraTarget: GeodeticPosition
): void => {
  const pose: GeodeticCameraPose = {
    position: cameraPosition,
    target: cameraTarget,
  }
  saveCameraPose(pomlId, pose)
}

const saveCameraPose = (
  pomlId: string,
  cameraPose: GeodeticCameraPose | CameraPose
): void => {
  const json = JSON.stringify(cameraPose)
  localStorage.setItem(`${CameraPoseStorageKeyPrefix}_${pomlId}`, json)
}

const loadBabylonCameraPose = (pomlId: string): CameraPose | undefined => {
  const json = localStorage.getItem(`${CameraPoseStorageKeyPrefix}_${pomlId}`)
  if (json) {
    const pose = JSON.parse(json) as unknown
    if (isCameraPose(pose)) {
      return pose
    }
  }
}

const loadGeodeticCameraPose = (
  pomlId: string
): GeodeticCameraPose | undefined => {
  const json = localStorage.getItem(`${CameraPoseStorageKeyPrefix}_${pomlId}`)
  if (json) {
    const pose = JSON.parse(json) as unknown
    if (isGeodeticCameraPose(pose)) {
      return pose
    }
  }
}

const geodeticCameraTargetDefault: GeodeticPosition = {
  latitude: 35.681574097903365,
  longitude: 139.76730785567287,
  ellipsoidalHeight: 0,
}

const geodeticCameraPositionDefault: GeodeticPosition = {
  latitude: geodeticCameraTargetDefault.latitude - 0.001,
  longitude: geodeticCameraTargetDefault.longitude,
  ellipsoidalHeight: 20000,
}

export type CameraControllerOptions = {
  maxZ: number
  lowerRadiusLimit?: Nullable<number>
  upperRadiusLimit?: Nullable<number>
}

export class CameraController implements ICameraController {
  public readonly camera: ArcRotateCamera
  private readonly app: App

  private readonly cameraTargetMarker: Mesh
  private readonly screenSpaceCamera: Camera

  // For geodetic mode
  private readonly geoManager: GeoManager | undefined
  private geodeticCameraPosition = geodeticCameraPositionDefault
  private geodeticCameraTarget = geodeticCameraTargetDefault

  constructor(
    scene: Scene,
    canvas: HTMLCanvasElement,
    geoManager: GeoManager | undefined,
    options: CameraControllerOptions
  ) {
    const engine = scene.getEngine()
    this.app = getApp(scene)

    this.geoManager = geoManager
    if (geoManager) {
      geoManager.onOriginChanged.add(
        (_) => {
          this.updateCameraPositionWithGeodeticPosition(this.camera)
        },
        (_) => {
          this.updateGeodeticPosition()
        }
      )
    }

    this.camera = this.createMainCamera(scene, canvas, options)

    this.cameraTargetMarker = createCameraTargetMarker(this.camera)
    this.cameraTargetMarker.setEnabled(false)

    this.screenSpaceCamera = createScreenSpaceCamera(engine, scene)

    // screenSpaceCamera is only valid in viewer mode.
    if (this.app.runMode === 'viewer') {
      scene.activeCameras = [this.camera, this.screenSpaceCamera]

      scene.onBeforeRenderObservable.add(() => {
        updateScreenSpaceCameraSize(engine, this.screenSpaceCamera)
      })

      scene.onPointerObservable.add((e) => {
        if (e.pickInfo === null || !e.pickInfo.hit) {
          scene.cameraToUseForPointers =
            scene.cameraToUseForPointers == this.camera
              ? this.screenSpaceCamera
              : this.camera
        }
      })
    }
  }

  /**
   * Adjusts the camera target to align with the terrain height.
   * Adjusts the camera position to avoid going behind the ground.
   */
  public alignWithTerrain(terrainHeight: number): void {
    const geoManager = this.geoManager
    if (geoManager === undefined) {
      return
    }

    const toGeodeticPosition = (position: Vector3) => {
      return geoManager.babylonPositionToGeodeticPosition(position)
    }

    const cameraTarget = this.camera.target
    const cameraPosition = this.camera.position
    const cameraDirection = cameraPosition.subtract(cameraTarget).normalize()

    const initialTargetGeodetic = toGeodeticPosition(cameraTarget)
    const initialTargetEllipsoidalHeightDifference =
      terrainHeight - initialTargetGeodetic.ellipsoidalHeight

    const additionalCameraMovement = cameraDirection.scale(
      initialTargetEllipsoidalHeightDifference
    )

    const targetGeodetic = toGeodeticPosition(
      cameraTarget.add(additionalCameraMovement)
    )
    const positionGeodetic = toGeodeticPosition(
      cameraPosition.add(additionalCameraMovement)
    )

    const targetEllipsoidalHeightDifference =
      terrainHeight - targetGeodetic.ellipsoidalHeight

    // Maintain the camera height when the camera moves.
    targetGeodetic.ellipsoidalHeight = terrainHeight
    positionGeodetic.ellipsoidalHeight = Math.max(
      positionGeodetic.ellipsoidalHeight + targetEllipsoidalHeightDifference,
      terrainHeight
    )

    this.camera.target =
      geoManager.geodeticPositionToBabylonPosition(targetGeodetic)
    this.camera.position =
      geoManager.geodeticPositionToBabylonPosition(positionGeodetic)
  }

  public setGeodeticCameraTarget(latitude: number, longitude: number): void {
    this.geodeticCameraTarget.latitude = latitude
    this.geodeticCameraTarget.longitude = longitude

    // To make the north face upwards on the screen, the camera position is adjusted slightly to the south.
    const cameraHeight = this.geodeticCameraPosition.ellipsoidalHeight
    const latitudeOffset = cameraHeight * 0.000001

    this.geodeticCameraPosition.latitude = latitude - latitudeOffset
    this.geodeticCameraPosition.longitude = longitude

    this.updateCameraPositionWithGeodeticPosition(this.camera)
  }

  public restoreCameraPose(): void {
    const isGeodeticMode = this.geoManager !== undefined

    if (isGeodeticMode) {
      const geodeticPose = loadGeodeticCameraPose(this.app.pomlId)
      if (geodeticPose) {
        this.geodeticCameraPosition = geodeticPose.position
        this.geodeticCameraTarget = geodeticPose.target
        this.updateCameraPositionWithGeodeticPosition(this.camera)
      }
    } else {
      const pose = loadBabylonCameraPose(this.app.pomlId)
      if (pose) {
        this.camera.position = new Vector3(
          pose.position.x,
          pose.position.y,
          pose.position.z
        )
        this.camera.target = new Vector3(
          pose.target.x,
          pose.target.y,
          pose.target.z
        )
      }
    }
  }

  /**
   * Adjusts the camera to fit the specified object in its field of view.
   * @param {TransformNode} node The target object.
   * @param {boolean} useAnimation Whether to use animation.
   * @return {*}  {Promise<boolean>} A Promise that resolves to a boolean indicating whether the adjustment was successful.
   * @memberof CameraController
   */
  public async adjust(
    node: TransformNode,
    useAnimation: boolean
  ): Promise<boolean> {
    // Adjusts the camera position to roughly fit within its field of view (not accurate).
    let { min, max } = node.getHierarchyBoundingVectors()

    // If the node has a GaussianSplattingMesh, adjust the bounding box to the world coordinates.
    const meshes = node.getChildMeshes()
    if (meshes.length >= 1) {
      const firstMesh = meshes[0]
      if (firstMesh instanceof GaussianSplattingMesh) {
        const worldMatrix = firstMesh.getWorldMatrix()
        min = Vector3.TransformCoordinates(min, worldMatrix)
        max = Vector3.TransformCoordinates(max, worldMatrix)
      }
    }

    const len = Vector3.Distance(min, max)
    if (len < 0.01 || Number.isFinite(len) == false) {
      return false
    }

    const fovy = this.getFovy()
    if (!fovy) {
      return false
    }

    // The proportion of the vertical screen space it occupies.
    const ratio = 0.5

    const distance = len / (ratio * 2 * Math.tan(fovy / 2))
    const dir = this.camera.getForwardRay(1).direction
    const offset = dir.multiplyByFloats(-distance, -distance, -distance)
    const center = min.add(max).divide(new Vector3(2, 2, 2))

    const camera = this.camera
    const result = {
      position: center.add(offset),
      target: center,
    }
    const current = {
      position: camera.position,
      target: camera.target,
    }

    const scene = camera.getScene()

    const time = useAnimation ? 400 : 0

    if (this.geoManager) {
      // Interpolation should be done with latitude and longitude in geographic positioning mode.
      const toGeodetic = (pos: Vector3, geoManager: GeoManager) => {
        return geoManager.babylonPositionToGeodeticPosition(pos)
      }
      const geodeticResult = {
        position: toGeodetic(result.position, this.geoManager),
        target: toGeodetic(result.target, this.geoManager),
      }
      const geodeticCurrent = {
        position: toGeodetic(current.position, this.geoManager),
        target: toGeodetic(current.target, this.geoManager),
      }
      await onFramesAsync(scene, 'beforeRender', time, (progress) => {
        this.geodeticCameraPosition = lerpGeodeticPosition(
          geodeticCurrent.position,
          geodeticResult.position,
          progress
        )
        this.geodeticCameraTarget = lerpGeodeticPosition(
          geodeticCurrent.target,
          geodeticResult.target,
          progress
        )
        this.updateCameraPositionWithGeodeticPosition(this.camera)
      })
    } else {
      await onFramesAsync(scene, 'beforeRender', time, (progress) => {
        camera.position = lerpVector3(
          current.position,
          result.position,
          progress
        )
        camera.target = lerpVector3(current.target, result.target, progress)
      })
    }
    return true
  }

  public toggleCameraTargetMarker() {
    this.cameraTargetMarker.setEnabled(!this.cameraTargetMarker.isEnabled())
  }

  private createMainCamera(
    scene: Scene,
    canvas: HTMLCanvasElement,
    options: CameraControllerOptions
  ): ArcRotateCamera {
    const camera: ArcRotateCamera = new ArcRotateCamera(
      'Camera',
      (-Math.PI * 5) / 12,
      Math.PI / 3,
      5,
      Vector3.Zero(),
      scene
    )

    camera.maxZ = options.maxZ
    camera.lowerRadiusLimit = options.lowerRadiusLimit ?? null
    camera.upperRadiusLimit = options.upperRadiusLimit ?? null

    camera.wheelDeltaPercentage = 0.15

    camera.inertia = 0
    camera.panningInertia = 0.1

    const cameraPointers = camera.inputs.attached.pointers
    if (cameraPointers instanceof ArcRotateCameraPointersInput) {
      // Set the camera control input to use only wheel and right click
      cameraPointers.buttons = [1, 2]
    }

    const keyboardInput = new KeyboardCameraPointersInput(camera)
    camera.inputs.add(keyboardInput)

    camera.attachControl(canvas, true)
    camera._panningMouseButton = 1

    // Set the initial camera position in geodetic mode.
    if (this.geoManager) {
      this.updateCameraPositionWithGeodeticPosition(camera)
    }

    camera.onViewMatrixChangedObservable.add((camera, _eventState) => {
      if (camera instanceof ArcRotateCamera) {
        // The smaller the number, the faster the movement
        camera.panningSensibility = 1600 * (1 / camera.radius)

        CameraController.calcCameraNearFar(camera)

        // Save the camera position to localStorage
        if (this.geoManager) {
          this.updateGeodeticPosition()
          saveGeodeticCameraPose(
            this.app.pomlId,
            this.geodeticCameraPosition,
            this.geodeticCameraTarget
          )
        } else {
          saveBabylonCameraPose(this.app.pomlId, camera)
        }
      }
    })

    return camera
  }

  /**
   * Update the camera position using the values of geodeticCameraPosition and geodeticCameraTarget.
   */
  private updateCameraPositionWithGeodeticPosition(
    camera: ArcRotateCamera
  ): void {
    if (this.geoManager) {
      camera.position = this.geoManager.geodeticPositionToBabylonPosition(
        this.geodeticCameraPosition
      )
      camera.target = this.geoManager.geodeticPositionToBabylonPosition(
        this.geodeticCameraTarget
      )

      if (camera.lowerRadiusLimit) {
        // When the radius is exactly the same as the lowerRadiusLimit,
        // it becomes impossible to zoom in/out with the mouse, so add a small value to the radius.
        camera.radius = Math.max(
          camera.radius,
          camera.lowerRadiusLimit + 0.0001
        )
      }
    }
  }

  private updateGeodeticPosition() {
    // In geodetic mode, it is necessary to change the camera position when the latitude and longitude of the origin change,
    // so keep the current latitude and longitude values.
    if (this.geoManager) {
      this.geodeticCameraPosition =
        this.geoManager.babylonPositionToGeodeticPosition(this.camera.position)
      this.geodeticCameraTarget =
        this.geoManager.babylonPositionToGeodeticPosition(this.camera.target)
    }
  }

  /**
   * Get the camera's Y-axis FOV.
   * @private
   * @return {*}  {(number | undefined)}
   * @memberof CameraController
   */
  private getFovy(): number | undefined {
    const camera = this.camera
    if (camera.fovMode === Camera.FOVMODE_VERTICAL_FIXED) {
      return camera.fov
    } else if (camera.fovMode === Camera.FOVMODE_HORIZONTAL_FIXED) {
      const canvasSize = getApp(camera.getScene())?.getCanvasSize()
      if (canvasSize) {
        const aspect = canvasSize.height / canvasSize.width
        const fovx = camera.fov
        return 2 * Math.atan(aspect * Math.tan(fovx / 2))
      }
    }
    return undefined
  }

  private static calcCameraNearFar(camera: ArcRotateCamera) {
    // The ratio of far to near.
    const CameraNearFarRange = 10000

    // Adjust the near and far planes based on the camera distance.
    // This is necessary to avoid parts of the scene not being rendered when viewing large buildings.
    let near = camera.radius / Math.sqrt(CameraNearFarRange)
    near = Math.min(50, Math.max(0.1, near))
    camera.minZ = near
    camera.maxZ = near * CameraNearFarRange
  }
}

const createCameraTargetMarker = (camera: ArcRotateCamera): Mesh => {
  const color: Color4 = new Color4(0.7, 0.7, 0, 1)
  const options = {
    height: 0.001,
    diameter: 0.01,
    faceColors: [color, color, color],
  }
  const marker = MeshBuilder.CreateCylinder('camera target', options)

  camera.onViewMatrixChangedObservable.add((camera, _eventState) => {
    if (camera instanceof ArcRotateCamera) {
      const radius = camera.radius

      marker.position = camera.target
      const scaling = radius
      marker.scaling.x = scaling
      marker.scaling.y = scaling
      marker.scaling.z = scaling
    }
  })

  return marker
}

/**
 * Executes a specified action every frame for a specified duration of time.
 * @param {Scene} scene The scene.
 * @param {FrameTiming} timing The timing of the action execution.
 * @param {number} time The duration of the execution (in ms).
 * @param {(progress: number) => void} action The action to execute every frame.
 */
function onFrameObservable(
  scene: Scene,
  timing: FrameTiming,
  time: number,
  action: (progress: number) => void
) {
  if (time <= 0) {
    action(1)
    return
  }
  const animation =
    timing === 'beforeRender'
      ? {
          register: (a: () => void) => scene.registerBeforeRender(a),
          unregister: (a: () => void) => scene.unregisterBeforeRender(a),
        }
      : {
          register: (a: () => void) => scene.registerAfterRender(a),
          unregister: (a: () => void) => scene.unregisterAfterRender(a),
        }

  let elapsed = 0
  const onAnimation = () => {
    const progress = elapsed / time
    action(progress)
    elapsed += scene.deltaTime
    if (elapsed > time) {
      action(1)
      animation.unregister(onAnimation)
    }
  }
  animation.register(onAnimation)
}

/**
 * Executes the specified action every frame for the specified duration of time, and waits until all actions have finished.
 * @param {Scene} scene The scene.
 * @param {FrameTiming} timing The timing of the action execution.
 * @param {number} time The duration of the execution (in ms).
 * @param {(progress: number) => void} action The action to execute every frame.
 * @return {*}  {Promise<void>}
 */
function onFramesAsync(
  scene: Scene,
  timing: FrameTiming,
  time: number,
  action: (progress: number) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    onFrameObservable(scene, timing, time, (progress) => {
      try {
        action(progress)
        if (progress >= 1) {
          resolve()
        }
      } catch {
        reject()
      }
    })
  })
}

/**
 * Linear interpolation of Vector3. start * (1 - ratio) + end * ratio
 * @param {Vector3} start Start value
 * @param {Vector3} end End value
 * @param {number} ratio Ratio
 * @return {*}  {Vector3} Interpolated value
 */
function lerpVector3(start: Vector3, end: Vector3, ratio: number): Vector3 {
  const p = 1 - ratio
  return start
    .multiplyByFloats(p, p, p)
    .add(end.multiplyByFloats(ratio, ratio, ratio))
}

function lerp(start: number, end: number, ratio: number): number {
  return start * (1 - ratio) + end * ratio
}

/**
 * Linear interpolation of GeodeticPosition. start * (1 - ratio) + end * ratio
 * @param {GeodeticPosition} start Start value
 * @param {GeodeticPosition} end End value
 * @param {number} ratio Ratio
 * @return {*}  {GeodeticPosition} Interpolated value
 */
function lerpGeodeticPosition(
  start: GeodeticPosition,
  end: GeodeticPosition,
  ratio: number
): GeodeticPosition {
  return {
    latitude: lerp(start.latitude, end.latitude, ratio),
    longitude: lerp(start.longitude, end.longitude, ratio),
    ellipsoidalHeight: lerp(
      start.ellipsoidalHeight,
      end.ellipsoidalHeight,
      ratio
    ),
  }
}
