import { Scene, SceneLoader, TransformNode } from '@babylonjs/core'
import { App } from '../app'
import {
  PointCloudData,
  PointCloudLoader,
} from '../spirareNode/pointCloudLoader'
import { PntsDataParser } from './pntsDataParser'
import { TileNode } from './tileNode'

export class PntsLoader {
  public static async loadUrlAsync(
    url: string,
    name: string,
    app: App,
    scene: Scene,
    parent?: TransformNode
  ): Promise<TileNode | undefined> {
    const response = await fetch(url)
    const blob = await response.blob()
    const target = {
      data: blob,
      name: name,
    }
    return await PntsLoader.loadCoreAsync(target, app, scene, parent)
  }

  public static async loadAsync(
    file: File,
    app: App,
    scene: Scene
  ): Promise<TileNode | undefined> {
    return await PntsLoader.loadCoreAsync(file, app, scene)
  }

  private static async loadCoreAsync(
    target: File | { data: Blob | Uint8Array; name: string },
    app: App,
    scene: Scene,
    parent?: TransformNode
  ): Promise<TileNode | undefined> {
    const data = target instanceof File ? target : target.data
    const pntsData = await PntsDataParser.parse(data)

    if (pntsData === undefined) {
      return undefined
    }

    const node = new TileNode(app.geoManager, scene, target.name)
    if (parent) {
      node.parent = parent
    }

    if (pntsData.rtcCenter) {
      node.originEcef = pntsData.rtcCenter
    }

    const pointCloudData: PointCloudData = {
      length: pntsData.length,
      positions: pntsData.positionArray,
      colors: pntsData.rgbArray,
    }
    const result = await PointCloudLoader.importAsync(pointCloudData, scene)
    if (result !== undefined) {
      result.meshes.forEach((x) => (x.parent = node))
    }

    return node
  }
}
