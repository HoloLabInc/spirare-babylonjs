import {
  Camera,
  TargetCamera,
  Frustum,
  Plane,
  Vector3,
  TransformNode,
  Scene,
} from '@babylonjs/core'
import { Tiles3DLoader } from '@loaders.gl/3d-tiles'
import { load } from '@loaders.gl/core'
import { TILE_REFINEMENT, Tileset3D } from '@loaders.gl/tiles'
import { Vector3 as GlVector3 } from '@math.gl/core'
import { App } from '../app'
import { B3dmLoader } from './b3dmLoader'
import { GeoManager } from './geoManager'
import { PntsLoader } from './pntsLoader'
import { TileNode } from './tileNode'
import { GlbLoader } from './glbLoader'
import TileHeader from '@loaders.gl/tiles/dist/tileset/tile-3d'

const Vector3ToGlVector3 = (vec: Vector3) => new GlVector3(vec.x, vec.y, vec.z)

const getRecursiveChildTiles = (tile: TileHeader): TileHeader[] => {
  return tile.children.flatMap((child) => {
    if (child.contentUrl) {
      return [child]
    } else {
      return getRecursiveChildTiles(child)
    }
  })
}

export class TilesLoader {
  private geoManager: GeoManager

  private tilesetIndex = 0

  private tileset3dMap = new Map<
    string,
    {
      tileset: Tileset3D
      rootNode: TransformNode
    }
  >()

  private tileNodeMap = new Map<
    string,
    {
      tileRootNode: TileNode
      loadPromise: Promise<TransformNode | undefined>
    }
  >()

  constructor(geoManager: GeoManager) {
    this.geoManager = geoManager
  }

  private async loadTileAsync(
    tile: TileHeader,
    rootNode: TransformNode,
    app: App,
    scene: Scene
  ) {
    if (!tile.contentUrl) {
      return
    }

    // If the tile is already loaded, return
    if (this.tileNodeMap.get(tile.contentUrl) !== undefined) {
      return
    }

    console.log('load ' + tile.contentUrl)
    const tileName = tile.contentUrl.split('/').pop() ?? ''
    const extension = tile.contentUrl.split('.').pop()?.split('?')[0]

    const tileRootNode = new TileNode(app.geoManager, scene, tileName)

    let loadPromise: Promise<TransformNode | undefined>

    switch (extension?.toLowerCase()) {
      case 'b3dm': {
        loadPromise = B3dmLoader.loadUrlAsync(
          tile.contentUrl,
          tileName,
          app,
          scene,
          tileRootNode
        )
        break
      }
      case 'glb': {
        loadPromise = GlbLoader.loadUrlAsync(
          tile.contentUrl,
          tileName,
          app,
          scene,
          tileRootNode
        )
        break
      }
      case 'pnts': {
        loadPromise = PntsLoader.loadUrlAsync(
          tile.contentUrl,
          tileName,
          app,
          scene,
          tileRootNode
        )
        break
      }
      case 'json': {
        // create empty node
        tileRootNode.parent = rootNode
        loadPromise = Promise.all(
          getRecursiveChildTiles(tile).map((child) => {
            this.loadTileAsync(child, tileRootNode, app, scene)
          })
        ).then(() => undefined)
        break
      }
      default:
        console.log(`${extension} is not supported`)
        tileRootNode.dispose()
        return
    }

    this.tileNodeMap.set(tile.contentUrl, { tileRootNode, loadPromise })

    let parentUrl
    let targetTile = tile
    while (true) {
      const parent = targetTile.parent
      if (!parent) {
        break
      }
      if (parent.contentUrl) {
        parentUrl = parent.contentUrl
        break
      }
      targetTile = parent
    }

    if (parentUrl) {
      let parentNodeData
      while (true) {
        parentNodeData = this.tileNodeMap.get(parentUrl)
        if (parentNodeData !== undefined) {
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      tileRootNode.parent = parentNodeData.tileRootNode

      if (tile.parent.refine === TILE_REFINEMENT.REPLACE) {
        const siblingPromise = Promise.all(
          getRecursiveChildTiles(tile.parent).map((sibling) => {
            this.loadTileAsync(sibling, rootNode, app, scene)
          })
        )

        parentNodeData.loadPromise.then(async (node) => {
          // Hide parent node after child nodes are loaded
          await Promise.all([loadPromise, siblingPromise])
          // If node is inherited from TileNode, call hide
          if (node instanceof TileNode) {
            node.hide()
          }
        })
      }
    } else {
      // If parent url is null
      const t = tile.transform
      const ecef = new Vector3(t[12], t[13], t[14])
      if (ecef.x !== 0 || ecef.y !== 0 || ecef.z !== 0) {
        tileRootNode.originEcef = ecef
      }
    }

    return loadPromise
  }

  public async loadAsync(url: string, name: string, app: App, scene: Scene) {
    const tilesetJson = await load(url, Tiles3DLoader)

    const rootNode = new TransformNode(name)

    const tileset3d = new Tileset3D(tilesetJson, {
      onTileLoad: async (tile) => {
        await this.loadTileAsync(tile, rootNode, app, scene)
      },
      onTileUnload: async (tile) => {
        console.log('on tile unload')
        const promise = this.tileNodeMap.get(tile.contentUrl)

        // Wait for the load to complete before unloading
        if (promise) {
          const tileRootNode = promise.tileRootNode
          const loadPromise = promise.loadPromise
          this.tileNodeMap.delete(tile.contentUrl)

          await loadPromise
          tileRootNode.dispose()
        }
      },
    })

    const tilesetId = `tileset-${this.tilesetIndex++}`
    this.tileset3dMap.set(tilesetId, { rootNode: rootNode, tileset: tileset3d })

    return tilesetId
  }

  public async removeAsync(tilesetId: string) {
    const value = this.tileset3dMap.get(tilesetId)
    if (value) {
      const { tileset, rootNode } = value
      tileset.destroy()
      rootNode.dispose()
      this.tileset3dMap.delete(tilesetId)
    }
  }

  public update(camera: TargetCamera) {
    if (this.tileset3dMap.size == 0) {
      return
    }

    const cameraDirection = camera.getDirection(new Vector3(0, 0, 1))
    const cameraUp = camera.upVector
    const cameraPosition = camera.position
    const cameraCenter = camera.target

    // The meaning of the number is not clear, but increasing it will cause more tiles to be loaded.
    const height = 100

    const frustumPlanes = this.getFrustumPlanes(camera)

    this.tileset3dMap.forEach(({ tileset }) => {
      tileset.update([
        {
          height,
          cameraDirection: Vector3ToGlVector3(cameraDirection),
          cameraUp: Vector3ToGlVector3(cameraUp),
          cameraPosition: Vector3ToGlVector3(cameraPosition),
          center: Vector3ToGlVector3(cameraCenter),
          distanceScales: {
            metersPerUnit: 1,
          },
          unprojectPosition: (vec: Vector3) => {
            const carto = this.geoManager.babylonPositionToGeodeticPosition(vec)
            return [carto.longitude, carto.latitude, carto.ellipsoidalHeight]
          },

          getFrustumPlanes: () => frustumPlanes,
        },
      ])
    })
  }

  private getFrustumPlanes(camera: Camera) {
    const frustumPlanes = this.getBabylonFrustumPlanes(camera)
    let planes = new Map<string, { normal: GlVector3; distance: number }>()
    for (const key in frustumPlanes) {
      const frustumPlane = frustumPlanes[key]
      planes.set(key, {
        normal: Vector3ToGlVector3(frustumPlane.normal),
        distance: frustumPlane.d,
      })
    }
    return planes
  }

  private getBabylonFrustumPlanes(camera: Camera): {
    far: Plane
    near: Plane
    right: Plane
    left: Plane
    top: Plane
    bottom: Plane
    [key: string]: Plane
  } {
    const cameraMatrix = camera.getTransformationMatrix()

    let far = new Plane(0, 0, 0, 0)
    Frustum.GetFarPlaneToRef(cameraMatrix, far)

    let near = new Plane(0, 0, 0, 0)
    Frustum.GetNearPlaneToRef(cameraMatrix, near)

    let right = new Plane(0, 0, 0, 0)
    Frustum.GetRightPlaneToRef(cameraMatrix, right)

    let left = new Plane(0, 0, 0, 0)
    Frustum.GetLeftPlaneToRef(cameraMatrix, left)

    let top = new Plane(0, 0, 0, 0)
    Frustum.GetTopPlaneToRef(cameraMatrix, top)

    let bottom = new Plane(0, 0, 0, 0)
    Frustum.GetBottomPlaneToRef(cameraMatrix, bottom)

    return {
      far,
      near,
      right,
      left,
      top,
      bottom,
    }
  }
}
