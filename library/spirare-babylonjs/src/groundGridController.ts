import {
  Color3,
  Mesh,
  MeshBuilder,
  Quaternion,
  TargetCamera,
  Vector3,
} from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'

export class GroundGridController {
  public gridPlane: Mesh

  constructor() {
    const gridMaterial = new GridMaterial('groundGridMaterial')
    gridMaterial.majorUnitFrequency = 10
    gridMaterial.minorUnitVisibility = 0.3
    gridMaterial.gridRatio = 1
    gridMaterial.backFaceCulling = false
    gridMaterial.mainColor = new Color3(1, 1, 1)
    gridMaterial.lineColor = new Color3(1, 1, 1)
    gridMaterial.opacity = 0.15

    const gridPlane = MeshBuilder.CreatePlane('groundGridPlane', {
      height: 1000,
      width: 1000,
    })
    gridPlane.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0)
    gridPlane.material = gridMaterial
    gridPlane.isPickable = false

    this.gridPlane = gridPlane
  }

  public updateGrid(camera: TargetCamera) {
    const cameraPosition = camera.position
    const cameraTarget = camera.target
    const cameraDistance = cameraPosition.subtract(cameraTarget).length()

    const gridToCameraDistance =
      (cameraDistance * cameraPosition.y) / (cameraPosition.y - cameraTarget.y)

    let gridPlaneScale = 1
    let distanceRangeMax = 100
    while (true) {
      if (gridToCameraDistance < distanceRangeMax) {
        break
      }

      gridPlaneScale *= 10
      distanceRangeMax *= 10
    }

    this.gridPlane.scaling = Vector3.One().scale(gridPlaneScale)
  }
}
