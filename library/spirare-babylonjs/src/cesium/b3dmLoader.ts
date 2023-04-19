import { Scene, SceneLoader, TransformNode } from '@babylonjs/core'
import { App } from '../app'
import { B3dmDataParser, implementsB3dmLocation } from './b3dmDataParser'
import { TileNode } from './tileNode'

export class B3dmLoader {
  public static async loadUrlAsync(
    url: string,
    name: string,
    app: App,
    scene: Scene,
    parent?: TransformNode
  ): Promise<TransformNode | undefined> {
    const response = await fetch(url)
    const blob = await response.blob()
    const target = {
      data: blob,
      name: name,
    }
    return await B3dmLoader.loadCoreAsync(target, app, scene, parent)
  }

  public static async loadAsync(
    file: File,
    app: App,
    scene: Scene
  ): Promise<TransformNode | undefined> {
    return await B3dmLoader.loadCoreAsync(file, app, scene)
  }

  private static async loadCoreAsync(
    target: File | { data: Blob | Uint8Array; name: string },
    app: App,
    scene: Scene,
    parent?: TransformNode
  ): Promise<TransformNode | undefined> {
    const data = target instanceof File ? target : target.data
    const b3dmData = await B3dmDataParser.parse(data)
    const url = URL.createObjectURL(b3dmData.glbBlob)
    try {
      const node = new TileNode(app.geoManager, scene, target.name)
      if (parent) {
        node.parent = parent
      }

      const loaded = await SceneLoader.ImportMeshAsync(
        undefined,
        url,
        undefined,
        undefined,
        undefined,
        '.glb'
      )
      const meshRoot = loaded.meshes.find((n) => n.id === '__root__')
      if (meshRoot) {
        meshRoot.setParent(node)
      }

      const b3dmEcef = [...loaded.meshes, ...loaded.transformNodes]
        .flatMap((n) => {
          if (implementsB3dmLocation(n)) {
            return [n.b3dmEcef]
          }
          return []
        })
        .pop()

      node.originEcef = b3dmEcef
      console.log(`b3dm file loaded: '${target.name}'`)
      return node
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}
