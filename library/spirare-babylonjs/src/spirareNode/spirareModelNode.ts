import {
  Mesh,
  Scene,
  SceneLoader,
  AbstractMesh,
  AnimationGroup,
  GaussianSplatting,
  Nullable,
} from '@babylonjs/core'
import { PomlModelElement } from 'ts-poml'
import { PointCloudLoader } from './pointCloudLoader'
import { IfcLoader } from 'web-ifc-babylon/dist/IfcLoader'
import { getFileLoadUrlAsync } from './spirareNodeUtils'
import { CreateNodeParams } from './spirareNode'
import { SpirareNodeBase } from './spirareNodeBase'
import { AnimationState, AnimationWrap } from '../wasm/spirare/spirareTypes'

export class SpirareModelNode extends SpirareNodeBase<PomlModelElement> {
  private modelMeshes: (Nullable<Mesh> | AbstractMesh)[] = []

  private currentAnimationGroup: AnimationGroup | undefined

  private animationGroups: AnimationGroup[] | undefined

  private disposes: { dispose: () => void }[] = []

  private _highlightable: boolean = true
  public override get highlightable(): boolean {
    return this._highlightable
  }

  public override get meshes(): AbstractMesh[] {
    return this.modelMeshes.filter((x): x is Mesh | AbstractMesh => x !== null)
  }

  private constructor(
    modelElement: PomlModelElement,
    params: CreateNodeParams
  ) {
    super(modelElement, params)

    this.onDisposeObservable.add(() => {
      this.cleanUp()
    })
  }

  private cleanUp(): void {
    this.unregisterActionManager()

    this.disposes.forEach((x) => x.dispose())
    this.disposes.length = 0

    this.modelMeshes = []

    this.currentAnimationGroup = undefined

    this.animationGroups?.forEach((x) => x.dispose())
    this.animationGroups = []
  }

  public static async create(
    modelElement: PomlModelElement,
    params: CreateNodeParams
  ): Promise<SpirareModelNode> {
    const node = new SpirareModelNode(modelElement, params)
    const name =
      modelElement.filename ?? modelElement.src?.split('/').pop() ?? ''
    await node.updateModel(name)
    return node
  }

  public getCurerntAnimationIndex(): number | undefined {
    if (this.animationGroups === undefined) {
      return undefined
    }

    const index = this.animationGroups.findIndex(
      (x) => x === this.currentAnimationGroup
    )

    if (index === -1) {
      return undefined
    } else {
      return index
    }
  }

  public getCurerntAnimationGroup(): AnimationGroup | undefined {
    return this.currentAnimationGroup
  }

  public getAnimationState(): AnimationState {
    const isPlaying = this.currentAnimationGroup?.isPlaying
    if (isPlaying === true) {
      return 'play'
    } else {
      return 'stop'
    }
  }

  public setAnimationState(animationState: AnimationState): boolean {
    if (this.currentAnimationGroup === undefined) {
      return false
    }

    switch (animationState) {
      case 'play':
        this.currentAnimationGroup.play()
        break
      case 'stop':
        this.currentAnimationGroup.pause()
        break
    }

    return true
  }

  public changeAnimationByName(
    animationName: string,
    wrap: AnimationWrap = 'loop',
    play: boolean = true
  ): boolean {
    return this.changeAnimation(animationName, wrap, play)
  }

  public changeAnimationByIndex(
    animationIndex: number,
    wrap: AnimationWrap = 'loop',
    play: boolean = true
  ): boolean {
    return this.changeAnimation(animationIndex, wrap, play)
  }

  private changeAnimation(
    animation: string | number,
    wrap: AnimationWrap = 'loop',
    play: boolean = true
  ): boolean {
    if (this.animationGroups === undefined) {
      return false
    }

    let animationGroup: AnimationGroup | undefined
    if (typeof animation === 'number') {
      animationGroup = this.animationGroups[animation]
    } else {
      animationGroup = this.animationGroups.find((x) => x.name === animation)
    }

    if (animationGroup === undefined) {
      return false
    }

    if (this.currentAnimationGroup !== animationGroup) {
      this.currentAnimationGroup?.stop()
      this.currentAnimationGroup = animationGroup
    }

    const loop = wrap === 'loop'
    animationGroup.start(loop)

    if (play === false) {
      animationGroup.pause()
    }

    return true
  }

  private async updateModel(name: string) {
    this.cleanUp()

    const scene = this.getScene()
    const loaded = await this.createModel(scene, this.element, name)
    if (loaded) {
      this.modelMeshes = loaded.meshes
      this.modelMeshes.forEach((mesh) => {
        if (mesh === null) {
          return
        }
        if (mesh.material) {
          this.disposes.push(mesh.material)
          mesh.material
            .getActiveTextures()
            .forEach((t) => this.disposes.push(t))
        }
        if (mesh.parent === null) {
          mesh.parent = this
        }
      })

      if ('animationGroups' in loaded) {
        this.animationGroups = loaded.animationGroups
        if (this.animationGroups.length > 0) {
          this.currentAnimationGroup = this.animationGroups[0]
        }
      }

      this.name += ` (${loaded.modelName})`
      this.registerActionManager()
      this.updateNodeObjectStatus()
    }
  }

  private async createModel(
    scene: Scene,
    element: PomlModelElement,
    name: string
  ) {
    try {
      const src = element.src
      const url = await getFileLoadUrlAsync(this)

      if (src === undefined || url === undefined) {
        return
      }

      const modelName = name

      // Get the file extension
      // If the filename is set, prioritize the extension of the filename
      const fileExt = (element.filename || src).split('.').pop()

      // Switch loaders depending on the file extension
      switch (fileExt) {
        case 'ply': {
          const loaded = await PointCloudLoader.importWithUrlAsync(
            url,
            fileExt,
            scene
          )
          if (loaded) {
            return {
              modelName,
              ...loaded,
            }
          } else {
            return undefined
          }
        }
        case 'ifc': {
          var ifc = new IfcLoader()
          await ifc.initialize()
          const response = await fetch(url)
          const blob = await response.blob()
          const arrayBuffer = await blob.arrayBuffer()
          const mesh = await ifc.load(new Uint8Array(arrayBuffer), scene, true)
          return {
            modelName,
            meshes: [mesh],
          }
        }
        case 'splat': {
          this._highlightable = false
          const gs = new GaussianSplatting('GaussianSplatting', scene)
          this.disposes.push(gs)
          await gs.loadFileAsync(url)

          if (gs.mesh !== null) {
            gs.mesh.parent = this
          }

          // Wait a few frames in order that focus works correctly
          for (let i = 0; i < 2; i++) {
            await new Promise<void>((resolve) => {
              scene.onAfterRenderObservable.addOnce(() => {
                resolve()
              })
            })
          }

          return {
            modelName,
            meshes: [gs.mesh],
          }
        }
        default: {
          const loaded = await SceneLoader.ImportMeshAsync(
            '',
            url,
            undefined,
            scene,
            undefined,
            '.glb'
          )
          return {
            modelName,
            ...loaded,
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}
