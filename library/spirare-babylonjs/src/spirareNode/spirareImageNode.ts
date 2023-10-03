import {
  Mesh,
  Scene,
  Texture,
  Material,
  BaseTexture,
  AbstractMesh,
  InspectableType,
} from '@babylonjs/core'
import { PomlImageElement } from 'ts-poml'
import { AnimatedGifTexture } from '../gif/animatedGifTexture'
import {
  createPlaneAndBackPlane,
  getFileLoadUrlAsync,
  getMediaDisplaySize,
} from './spirareNodeUtils'
import { CreateNodeParams } from './spirareNode'
import {
  SpirareMediaNodeBase,
  mediaElementInspectables,
} from './spirareMediaNodeBase'

export class SpirareImageNode extends SpirareMediaNodeBase<PomlImageElement> {
  private imageTexture?: BaseTexture
  private imageMaterial?: Material
  private backMaterial?: Material
  private plane?: Mesh
  private backPlane?: Mesh

  protected override get meshes(): (AbstractMesh | undefined)[] {
    return [this.plane, this.backPlane]
  }

  private constructor(
    imageElement: PomlImageElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(imageElement, params, name)

    if (this.app.runMode === 'editor') {
      this.inspectableCustomProperties.push(
        {
          label: '==== PomlImageElement ====',
          propertyName: '',
          type: InspectableType.Tab,
        },
        ...mediaElementInspectables
      )

      this.updateBackfaceColorInspector()
    }

    this.onDisposeObservable.add(() => {
      this.cleanUp()
    })
  }

  private cleanUp(): void {
    this.imageTexture?.dispose()
    this.imageMaterial?.dispose()
    this.backMaterial?.dispose()
    this.plane?.dispose()
    this.backPlane?.dispose()
    this.imageTexture = undefined
    this.imageMaterial = undefined
    this.backMaterial = undefined
    this.plane = undefined
    this.backPlane = undefined
  }

  public static async create(
    imageElement: PomlImageElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareImageNode> {
    const node = new SpirareImageNode(imageElement, params, name)
    await node.updateObject()
    return node
  }

  protected override async updateObject(): Promise<void> {
    const scene = this.getScene()
    const created = await this.createImage(scene, this.element)
    this.cleanUp()
    if (created) {
      this.plane = created.plane
      this.backPlane = created.backPlane
      this.imageTexture = created.imageTexture
      this.imageMaterial = created.material
      this.backMaterial = created.backMaterial

      this.plane.parent = this
      if (this.backPlane !== undefined) {
        this.backPlane.parent = this
      }

      this.plane.actionManager = this.actionManager
      if (this.backPlane !== undefined) {
        this.backPlane.actionManager = this.actionManager
      }

      this.updateDisplay()
      this.updateLayerMask()
    }
  }

  private async createImage(scene: Scene, element: PomlImageElement) {
    const src = element.src
    const url = await getFileLoadUrlAsync(this)

    if (src === undefined || url === undefined) {
      return
    }

    // Get the file extension
    // If the filename is set, prioritize the extension of the filename
    const fileExt = (element.filename || src).split('.').pop()

    const texture = await this.loadImageToTexture(url, fileExt, scene)

    if (texture === undefined) {
      return undefined
    }

    const size = texture.getSize()
    const displaySize = getMediaDisplaySize(element, size)

    if (displaySize.width === 0 || displaySize.height === 0) {
      texture.dispose()
      return undefined
    }

    const backfaceOption = {
      mode: element.backfaceMode ?? 'none',
      color: element.backfaceColor ?? 'white',
    }

    const textureOption = {
      texture: texture,
      transparent: true,
    }

    if (this.app.runMode === 'editor') {
      // Show backface in editor mode
      if (backfaceOption.mode === 'none') {
        backfaceOption.mode = 'solid'
        backfaceOption.color = 'black'
      }

      textureOption.transparent = false
    }

    const created = createPlaneAndBackPlane(
      displaySize,
      scene,
      textureOption,
      'image',
      backfaceOption
    )

    return {
      imageTexture: texture,
      ...created,
    }
  }

  /**
   * Load an image and create a texture from it
   * @param url
   * @param fileExt
   * @param scene
   * @returns
   */
  private async loadImageToTexture(
    url: string,
    fileExt: string | undefined,
    scene: Scene
  ): Promise<BaseTexture | undefined> {
    if (fileExt == 'gif') {
      const engine = scene.getEngine()

      return new Promise<BaseTexture | undefined>((resolve, reject) => {
        const texture = new AnimatedGifTexture(
          url,
          engine,
          // onLoad
          () => {
            resolve(texture)
          },
          // onError
          (e) => {
            console.log(e)
            resolve(undefined)
          }
        )
      })
    } else {
      return new Promise<BaseTexture | undefined>((resolve, reject) => {
        const texture = new Texture(
          url,
          scene,
          undefined,
          undefined,
          undefined,
          // onLoad
          () => {
            resolve(texture)
          },
          // onError
          (message?: string, exception?: any) => {
            console.log(message)
            console.log(exception)
            resolve(undefined)
          }
        )
      })
    }
  }
}
