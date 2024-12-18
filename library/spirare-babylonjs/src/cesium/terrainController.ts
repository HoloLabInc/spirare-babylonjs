import {
  Color3,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'
import { CesiumManager } from '../cesiumManager'
import { GeodeticPosition, GeoManager } from './geoManager'

type TerrainMeshInfo = {
  scene: Scene
  vertices: GeodeticPosition[]
  gridNumberX: number
  gridNumberZ: number
}

export class TerrainController {
  private cesiumManager: CesiumManager
  private geoManager: GeoManager

  private latestTerrainMeshInfo: TerrainMeshInfo | undefined

  private latestTerrainIntervalSize: number | undefined
  private latestTerrainCenterEcef: Vector3 | undefined
  private latestTerrain: Mesh | undefined

  private terrainMaterial: Material | undefined

  constructor(cesiumManager: CesiumManager, geoManager: GeoManager) {
    this.cesiumManager = cesiumManager
    this.geoManager = geoManager

    geoManager.onOriginChanged.add((_) => {
      if (this.latestTerrainMeshInfo) {
        this.updateTerrainMesh(this.latestTerrainMeshInfo)
      }
    })
  }

  public async UpdateTerrainAsync(
    scene: Scene,
    center: Vector3,
    gridNumber: number,
    intervalSize: number,
    useSimplifiedTerrain: boolean
  ) {
    const centerEcef = this.geoManager.babylonPositionToEcefPosition(center)

    // Skip update if there is no change from previous state.
    if (
      this.latestTerrainCenterEcef !== undefined &&
      this.latestTerrainIntervalSize !== undefined
    ) {
      if (
        Vector3.Distance(this.latestTerrainCenterEcef, centerEcef) < 0.01 &&
        this.latestTerrainIntervalSize == intervalSize
      ) {
        return
      }
    }

    this.latestTerrainIntervalSize = intervalSize
    this.latestTerrainCenterEcef = centerEcef

    const gridNumberX = gridNumber
    const gridNumberZ = gridNumber

    const geodeticPositions: GeodeticPosition[] = []

    for (let l = 0; l < gridNumberZ; l++) {
      for (let w = 0; w < gridNumberX; w++) {
        const x = (w - gridNumberX * 0.5) * intervalSize + center.x
        const z = (l - gridNumberZ * 0.5) * intervalSize + center.z
        const y = center.y

        const point = new Vector3(x, y, z)
        const geodeticPosition =
          this.geoManager.babylonPositionToGeodeticPosition(point)
        geodeticPositions.push(geodeticPosition)
      }
    }

    let vertices
    if (useSimplifiedTerrain) {
      // Do not get terrain height.
      vertices = geodeticPositions
    } else {
      vertices = await this.cesiumManager.sampleTerrainAsync(geodeticPositions)
    }

    this.latestTerrainMeshInfo = {
      scene,
      vertices,
      gridNumberX,
      gridNumberZ,
    }

    this.updateTerrainMeshAsync(this.latestTerrainMeshInfo, scene)
  }

  /**
   * Create a terrain mesh and dispose of the current mesh.
   * @param meshInfo Information needed to create the mesh.
   */
  private async updateTerrainMeshAsync(
    meshInfo: TerrainMeshInfo,
    scene: Scene
  ) {
    const previousTerrain = this.latestTerrain

    const terrain = this.createTerrainMesh(
      meshInfo.vertices,
      meshInfo.gridNumberX,
      meshInfo.gridNumberZ,
      meshInfo.scene
    )

    this.latestTerrain = terrain

    // Wait for one frame.
    await new Promise<void>((resolve) => {
      scene.onAfterRenderObservable.addOnce(() => {
        resolve()
      })
    })

    if (previousTerrain) {
      previousTerrain.dispose()
    }
  }

  /**
   * Creates a mesh for the Terrain
   * @param vertices
   * @param gridNumberX
   * @param gridNumberZ
   * @param scene
   * @returns
   */
  private createTerrainMesh(
    vertices: GeodeticPosition[],
    gridNumberX: number,
    gridNumberZ: number,
    scene: Scene
  ): Mesh {
    // Creates data for Mesh
    const paths = []
    for (let l = 0; l < gridNumberZ; l++) {
      var path = []
      for (let w = 0; w < gridNumberX; w++) {
        const babylonPoint = this.geoManager.geodeticPositionToBabylonPosition(
          vertices[l * gridNumberX + w]
        )
        path.push(babylonPoint)
      }
      paths.push(path)
    }

    // Create a Mesh.
    const terrain = MeshBuilder.CreateRibbon(
      'terrain',
      { pathArray: paths, sideOrientation: 2 },
      scene
    )

    terrain.isPickable = false
    terrain.material = this.getTerrainMaterial(scene)

    return terrain
  }

  private getTerrainMaterial(scene: Scene, debug: boolean = false) {
    if (this.terrainMaterial) {
      return this.terrainMaterial
    }

    const terrainMaterial = new StandardMaterial('terrainMaterial', scene)
    terrainMaterial.diffuseColor = Color3.Black()

    if (debug) {
      terrainMaterial.wireframe = true
      terrainMaterial.alpha = 1.0
    } else {
      terrainMaterial.alpha = 0.0
    }

    terrainMaterial.transparencyMode = 0 // OPAQUE
    terrainMaterial.disableLighting = true

    this.terrainMaterial = terrainMaterial
    return terrainMaterial
  }
}
