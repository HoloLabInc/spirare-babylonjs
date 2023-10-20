declare var XR8: any

import {
  FreeCamera,
  Scene,
  TargetCamera,
  TransformNode,
  Vector3,
} from 'spirare-babylonjs/node_modules/@babylonjs/core'

import { ICameraController } from 'spirare-babylonjs/src/camera/iCameraController'

export class ArCameraController implements ICameraController {
  public camera: TargetCamera

  constructor(scene: Scene) {
    const camera = new FreeCamera('camera', new Vector3(0, 0, 0), scene)
    camera.minZ = 0.001

    // Connect camera to XR and show camera feed.
    camera.addBehavior(XR8.Babylonjs.xrCameraBehavior(), true)

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
