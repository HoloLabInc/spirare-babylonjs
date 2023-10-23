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

  private gridMaterial: GridMaterial

  constructor() {
    const gridMaterial = new GridMaterial('groundGridMaterial')
    gridMaterial.majorUnitFrequency = 10
    gridMaterial.minorUnitVisibility = 0.45
    gridMaterial.gridRatio = 1
    gridMaterial.backFaceCulling = false
    gridMaterial.mainColor = new Color3(1, 1, 1)
    gridMaterial.lineColor = new Color3(1, 1, 1)
    gridMaterial.opacity = 0.3

    const gridPlane = MeshBuilder.CreatePlane('plane', {
      height: 1000,
      width: 1000,
    })
    gridPlane.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0)
    gridPlane.material = gridMaterial
    gridPlane.isPickable = false

    this.gridMaterial = gridMaterial
    this.gridPlane = gridPlane

    // this.highlightLayer.addExcludedMesh(gridPlane)

    // this.gridPlane = gridPlane
  }

  public updateGrid(camera: TargetCamera) {
    const cameraPosition = camera.position
    const cameraTarget = camera.target
    const cameraDistance = cameraPosition.subtract(cameraTarget).length()

    const gridToCameraDistance =
      (cameraDistance * cameraPosition.y) / (cameraPosition.y - cameraTarget.y)

    if (this.gridPlane !== undefined) {
      let gridPlaceScale = 1
      if (gridToCameraDistance < 100) {
        // gridPlane
      } else if (gridToCameraDistance < 1000) {
        gridPlaceScale = 10
      } else if (gridToCameraDistance < 10000) {
        gridPlaceScale = 100
      } else {
        gridPlaceScale = 1000
      }
      this.gridPlane.scaling = Vector3.One().scale(gridPlaceScale)
    }
  }
}
