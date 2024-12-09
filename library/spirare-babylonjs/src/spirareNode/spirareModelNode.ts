import {
  Mesh,
  Scene,
  SceneLoader,
  AbstractMesh,
  AnimationGroup,
  GaussianSplattingMesh,
  Nullable,
} from '@babylonjs/core'
import { PomlModelElement } from 'ts-poml'
import { PointCloudLoader } from './pointCloudLoader'
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

      this.animationGroups = loaded.animationGroups
      if (this.animationGroups && this.animationGroups.length > 0) {
        this.currentAnimationGroup = this.animationGroups[0]
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
  ): Promise<
    | {
        modelName: string
        meshes: (AbstractMesh | Nullable<Mesh>)[]
        animationGroups: AnimationGroup[] | undefined
      }
    | undefined
  > {
    try {
      const src = element.src
      const url = await getFileLoadUrlAsync(this)

      if (src === undefined || url === undefined) {
        return
      }

      const modelName = name

      // Get the file extension
      // If the filename is set, prioritize the extension of the filename
      const fileExt = (element.filename || src)
        .split('.')
        .pop()
        ?.toLocaleLowerCase()

      if (fileExt === undefined) {
        return
      }

      let loadFuncion: LoadFunction
      switch (fileExt) {
        case 'glb':
        case 'ply':
        case 'splat':
        case 'spz':
          loadFuncion = loadMeshAsync
          break
        default:
          console.log(`Unsupported model file type: ${fileExt}`)
          return
      }

      const result = await loadFuncion(url, fileExt, scene)

      if (result.success) {
        this.disposes.push(...result.disposes)
        this._highlightable = result.highlightable

        return {
          modelName,
          meshes: result.meshes,
          animationGroups: result.animationGroups,
        }
      } else {
        return undefined
      }
    } catch (e) {
      console.log(e)
    }
  }
}

type LoadFunction = (
  url: string,
  fileExtention: string,
  scene: Scene
) => Promise<{
  success: boolean
  disposes: { dispose: () => void }[]
  meshes: (AbstractMesh | Nullable<Mesh>)[]
  highlightable: boolean
  animationGroups: AnimationGroup[] | undefined
}>

const loadMeshAsync: LoadFunction = async (
  url: string,
  fileExtention: string,
  scene: Scene
) => {
  const loaded = await SceneLoader.ImportMeshAsync(
    '',
    url,
    undefined,
    scene,
    undefined,
    `.${fileExtention}`
  )

  // Wait for mesh is loaded.
  await new Promise<void>((resolve) => {
    const observer = scene.onBeforeRenderObservable.add(() => {
      if (loaded.meshes.length > 0) {
        scene.onBeforeRenderObservable.remove(observer)
        resolve()
      }
    })
  })

  return {
    success: true,
    disposes: [],
    meshes: loaded.meshes,
    highlightable: isMeshHighlightable(loaded.meshes),
    animationGroups: loaded.animationGroups,
  }
}

const isMeshHighlightable = (meshes: AbstractMesh[]): boolean => {
  for (const mesh of meshes) {
    if (mesh instanceof GaussianSplattingMesh) {
      return false
    }
  }
  return true
}
