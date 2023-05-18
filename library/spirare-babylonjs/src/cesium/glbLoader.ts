import { Scene, SceneLoader, TransformNode, Vector3 } from '@babylonjs/core'
import { App } from '../app'
import { B3dmDataParser, implementsB3dmLocation } from './b3dmDataParser'
import { TileNode } from './tileNode'

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


      //console.log(meshes)
      meshes.forEach((mesh) => {
        /*
        if (mesh.material) {
          this.disposes.push(mesh.material)
          mesh.material
            .getActiveTextures()
            .forEach((t) => this.disposes.push(t))
        }
        */
        //console.log({ meshParent: mesh.parent })
        if (mesh.parent === null) {
          mesh.parent = node
        }
        //mesh.actionManager = this.actionManager
      })

      /*
      const meshRoot = loaded.meshes.find((n) => n.id === '__root__')
      if (meshRoot) {
        meshRoot.setParent(node)
      }
      */

      const b3dmEcef = [...loaded.meshes, ...loaded.transformNodes]
        .flatMap((n) => {
          if (implementsB3dmLocation(n)) {
            return [n.b3dmEcef]
          }
          return []
        })
        .pop()

      // node.originEcef = b3dmEcef
      node.originEcef = new Vector3(0, 0, 0)
      // console.log(`glb file loaded: '${target.name}'`)
      return node
    } catch (ex) {
      console.error(ex)
    } finally {
      URL.revokeObjectURL(url)
    }
    // return undefined

    // const b3dmData = await B3dmDataParser.parse(data)
    /*
    // const b3dmData = await B3dmDataParser.parse(data)
    // const url = URL.createObjectURL(b3dmData.glbBlob)
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
    */
  }
}
