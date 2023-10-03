import {
  Mesh,
  Scene,
  Material,
  VideoTexture,
  AbstractMesh,
  InspectableType,
} from '@babylonjs/core'
import { PomlVideoElement } from 'ts-poml'
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

export class SpirareVideoNode extends SpirareMediaNodeBase<PomlVideoElement> {
  private videoTexture?: VideoTexture
  private videoMaterial?: Material
  private backMaterial?: Material
  private plane?: Mesh
  private backPlane?: Mesh
  private _video?: HTMLVideoElement

  public get video(): HTMLVideoElement | undefined {
    return this._video
  }

  protected override get meshes(): (AbstractMesh | undefined)[] {
    return [this.plane, this.backPlane]
  }

  private constructor(
    videoElement: PomlVideoElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(videoElement, params, name)

    if (this.app.runMode === 'editor') {
      this.inspectableCustomProperties.push(
        {
          label: '==== PomlVideoElement ====',
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

  public static async create(
    videoElement: PomlVideoElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareVideoNode> {
    const node = new SpirareVideoNode(videoElement, params, name)

    // In case video playback fails, we don't want to wait for updateVideo() to complete before exiting the create method.
    // Therefore, updateVideo() is called asynchronously and is not awaited.
    node.updateObject().then(async () => {
      try {
        if (node.video) {
          // Mute the video to avoid sudden loud sounds and play it
          node.video.muted = true
          // Resolve the Promise when video playback starts
          await node.video.play()
        }
      } catch (ex) {
        console.log(ex)
      }
    })
    return node
  }

  protected override async updateObject(): Promise<void> {
    const scene = this.getScene()
    const created = await this.createVideo(scene, this.element)

    this.cleanUp()
    if (created) {
      this.plane = created.plane
      this.backPlane = created.backPlane
      this.videoTexture = created.videoTexture
      this.videoMaterial = created.material
      this.backMaterial = created.backMaterial
      this._video = created.videoTexture.video
      created.plane.parent = this
      created.backPlane.parent = this

      this.plane.actionManager = this.actionManager
      this.backPlane.actionManager = this.actionManager

      this.updateDisplay()
      this.updateLayerMask()
    }
  }

  private cleanUp(): void {
    this.plane?.dispose()
    this.backPlane?.dispose()
    this.videoTexture?.dispose()
    this.videoMaterial?.dispose()
    this.backMaterial?.dispose()
    this.plane = undefined
    this.backPlane = undefined
    this.videoTexture = undefined
    this.videoMaterial = undefined
    this.backMaterial = undefined
    this._video = undefined
  }

  private async createVideo(scene: Scene, element: PomlVideoElement) {
    const src = element.src
    const url = await getFileLoadUrlAsync(this)

    if (src === undefined || url === undefined) {
      return
    }

    const videoTexture = new VideoTexture('videoTexture', url, scene)
    await new Promise<void>((resolve, reject) => {
      videoTexture.onLoadObservable.add(() => {
        resolve()
      })
    })

    const size = videoTexture.getSize()
    const displaySize = getMediaDisplaySize(element, size)

    if (displaySize.width === 0 || displaySize.height === 0) {
      videoTexture.dispose()
      return undefined
    }

    const backfaceOption = {
      mode: element.backfaceMode ?? 'none',
      color: element.backfaceColor ?? 'white',
    }

    // Show backface in editor mode
    if (this.app.runMode === 'editor') {
      if (backfaceOption.mode === 'none') {
        backfaceOption.mode = 'solid'
        backfaceOption.color = 'black'
      }
    }

    const created = createPlaneAndBackPlane(
      displaySize,
      scene,
      videoTexture,
      'video',
      backfaceOption
    )

    return {
      videoTexture: videoTexture,
      ...created,
    }
  }
}
