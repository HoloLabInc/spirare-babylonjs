import { Scene, SceneLoader, TransformNode, Vector3 } from '@babylonjs/core'
import { App } from '../app'
import { TileNode } from './tileNode'

const getCopyrightFromGlb = async (blob: Blob) => {
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const view = new DataView(data.buffer)

    const chunkLength = view.getUint32(12, true)

    const jsonDataView = data.slice(20, 20 + chunkLength)
    const decoder = new TextDecoder('utf-8')
    const text = decoder.decode(jsonDataView)

    const json = JSON.parse(text)
    return json.asset?.copyright
  } catch (e) {
    return undefined
  }
}

export class GlbLoader {
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
    return await GlbLoader.loadCoreAsync(target, app, scene, parent)
  }

  public static async loadAsync(
    file: File,
    app: App,
    scene: Scene
  ): Promise<TransformNode | undefined> {
    return await GlbLoader.loadCoreAsync(file, app, scene)
  }

  private static async loadCoreAsync(
    target: File | { data: Blob | Uint8Array; name: string },
    app: App,
    scene: Scene,
    parent?: TransformNode
  ): Promise<TransformNode | undefined> {
    let data = target instanceof File ? target : target.data
    // console.log(data)
    if (data instanceof Uint8Array) {
      data = new Blob([data])
    }

    const copyright = await getCopyrightFromGlb(data)
    const copyrightArray = copyright.split(';')
    app.addDataAttribution(copyrightArray)

    const url = URL.createObjectURL(data)

    try {
      const node = new TileNode(app.geoManager, scene, 'TileNode' + target.name)
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

      const meshes = loaded.meshes
      node.meshes = meshes

      meshes.forEach((mesh) => {
        /*
        if (mesh.material) {
          this.disposes.push(mesh.material)
          mesh.material
            .getActiveTextures()
            .forEach((t) => this.disposes.push(t))
        }
        */
        if (mesh.parent === null) {
          mesh.parent = node
        }
        //mesh.actionManager = this.actionManager
      })

      /*
      const b3dmEcef = [...loaded.meshes, ...loaded.transformNodes]
        .flatMap((n) => {
          if (implementsB3dmLocation(n)) {
            return [n.b3dmEcef]
          }
          return []
        })
        .pop()
        */

      // node.originEcef = b3dmEcef
      node.originEcef = new Vector3(0, 0, 0)
      return node
    } catch (ex) {
      console.error(ex)
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}
