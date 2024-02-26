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
  private videoTextureUrl?: string
  private videoMaterial?: Material
  private backMaterial?: Material
  private plane?: Mesh
  private backPlane?: Mesh
  private _video?: HTMLVideoElement

  public get video(): HTMLVideoElement | undefined {
    return this._video
  }

  public override get meshes(): AbstractMesh[] {
    return [this.plane, this.backPlane].filter(
      (x): x is Mesh => x !== undefined
    )
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
          label: '==== Video Element Settings ====',
          propertyName: '',
          type: InspectableType.Tab,
        },
        ...mediaElementInspectables
      )

      this.updateBackfaceColorInspector()
    }

    this.onDisposeObservable.add(() => {
      this.cleanUpUnnecessaryResource(undefined)
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

    this.cleanUpUnnecessaryResource(created)
    if (created) {
      this.plane = created.plane
      this.backPlane = created.backPlane
      this.videoTexture = created.videoTexture
      this.videoMaterial = created.material
      this.backMaterial = created.backMaterial
      this._video = created.videoTexture.video

      this.plane.parent = this
      if (this.backPlane !== undefined) {
        this.backPlane.parent = this
      }

      this.registerActionManager()
      this.updateNodeObjectStatus()
    }
  }

  private cleanUpUnnecessaryResource(
    newResource:
      | {
          plane: Mesh
          material: Material
          backPlane?: Mesh | undefined
          backMaterial?: Material | undefined
          videoTexture: VideoTexture
        }
      | undefined
  ): void {
    if (this.plane !== newResource?.plane) {
      this.plane?.dispose()
      this.plane = undefined
    }

    if (this.videoMaterial !== newResource?.material) {
      this.videoMaterial?.dispose()
      this.videoMaterial = undefined
    }

    if (this.backPlane !== newResource?.backPlane) {
      this.backPlane?.dispose()
      this.backPlane = undefined
    }

    if (this.backMaterial !== newResource?.backMaterial) {
      this.backMaterial?.dispose()
      this.backMaterial = undefined
    }

    if (this.videoTexture !== newResource?.videoTexture) {
      this.videoTexture?.dispose()
      this.videoTexture = undefined
      this._video = undefined
    }
  }

  private async createVideo(scene: Scene, element: PomlVideoElement) {
    const src = element.src
    const url = await getFileLoadUrlAsync(this)

    if (src === undefined || url === undefined) {
      return
    }

    let videoTexture: VideoTexture | undefined
    if (url === this.videoTextureUrl && this.videoTexture !== undefined) {
      videoTexture = this.videoTexture
    } else {
      videoTexture = new VideoTexture('videoTexture', url, scene)
      await new Promise<void>((resolve, reject) => {
        videoTexture?.onLoadObservable.add(() => {
          resolve()
        })
      })
      this.videoTextureUrl = url
    }

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

    const textureOption = {
      texture: videoTexture,
      transparent: true,
    }

    // Show backface in editor mode
    if (this.app.runMode === 'editor') {
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
      'video',
      backfaceOption
    )

    return {
      videoTexture: videoTexture,
      ...created,
    }
  }
}
