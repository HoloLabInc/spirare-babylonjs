import {
  Color4,
  DeviceOrientationCamera,
  Scene,
  TargetCamera,
  TransformNode,
  Vector3,
} from '@babylonjs/core'
import { ICameraController } from '../camera/iCameraController'
import { CameraControllerFactory } from '../app'

export class DeviceOrientationCameraController implements ICameraController {
  public camera: TargetCamera

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new DeviceOrientationCamera(
      'DeviceOrientationCamera',
      new Vector3(0, 0, 0),
      scene
    )
    camera.minZ = 0.001
    camera.attachControl(canvas, true)

    this.camera = camera
  }

  alignWithTerrain(terrainHeight: number): void {
    // Do nothing
  }

  setGeodeticCameraTarget(latitude: number, longitude: number): void {
    // Do nothing
  }

  restoreCameraPose(): void {
    // Do nothing
  }

  adjust(node: TransformNode, useAnimation: boolean): Promise<boolean> {
    // Do nothing
    return Promise.resolve(true)
  }

  toggleCameraTargetMarker(): void {
    // Do nothing
  }
}

export const deviceOrientationCameraControllerFactory: CameraControllerFactory =
  (app, scene, canvas) => {
    scene.clearColor = new Color4(0, 0, 0, 0)
    const cameraController = new DeviceOrientationCameraController(
      scene,
      canvas
    )
    return cameraController
  }
