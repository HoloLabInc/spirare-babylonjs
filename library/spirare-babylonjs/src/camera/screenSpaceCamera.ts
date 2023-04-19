import { Camera, Engine, FreeCamera, Scene, Vector3 } from '@babylonjs/core'

const screenSpaceLayerMask = 0x10000000

export const createScreenSpaceCamera = (
  engine: Engine,
  scene: Scene
): FreeCamera => {
  const camera = new FreeCamera(
    'ScreenSpaceCamera',
    new Vector3(0, 0, -1000),
    scene
  )

  camera.minZ = 0
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA
  camera.layerMask = screenSpaceLayerMask

  updateScreenSpaceCameraSize(engine, camera)

  return camera
}

export const updateScreenSpaceCameraSize = (
  engine: Engine,
  camera: Camera
): void => {
  const aspectRatio = engine.getRenderWidth() / engine.getRenderHeight()

  camera.orthoTop = 0.5
  camera.orthoBottom = -0.5

  camera.orthoRight = 0.5 * aspectRatio
  camera.orthoLeft = -0.5 * aspectRatio
}
