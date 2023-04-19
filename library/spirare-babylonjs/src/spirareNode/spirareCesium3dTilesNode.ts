import { Scene } from '@babylonjs/core'
import { PomlCesium3dTilesElement } from 'ts-poml'
import { getFileLoadUrlAsync } from './spirareNodeUtils'
import { SpirareNodeBase } from './spirareNodeBase'
import { CreateNodeParams } from './spirareNode'

export class SpirareCesium3dTilesNode extends SpirareNodeBase<PomlCesium3dTilesElement> {
  private disposes: { dispose: () => void }[] = []
  private tilesetId: string | undefined

  private constructor(
    modelElement: PomlCesium3dTilesElement,
    params: CreateNodeParams
  ) {
    super(modelElement, params)
    this.onDisposeObservable.add(() => {
      this.cleanUp()
    })
  }

  private cleanUp(): void {
    this.disposes.forEach((x) => x.dispose())
    this.disposes.length = 0

    if (this.tilesetId) {
      this.app.tilesLoader.removeAsync(this.tilesetId)
      this.tilesetId = undefined
    }
  }

  public static async create(
    cesium3dTilesElement: PomlCesium3dTilesElement,
    params: CreateNodeParams
  ): Promise<SpirareCesium3dTilesNode> {
    const node = new SpirareCesium3dTilesNode(cesium3dTilesElement, params)
    const name =
      cesium3dTilesElement.filename ??
      cesium3dTilesElement.src?.split('/').pop() ??
      ''
    await node.updateTiles(name, params.scene)
    return node
  }

  private async updateTiles(name: string, scene: Scene) {
    this.cleanUp()

    const url = await getFileLoadUrlAsync(this)
    if (url) {
      this.tilesetId = await this.app.tilesLoader.loadAsync(
        url,
        name,
        this.app,
        scene
      )
    }
  }
}
