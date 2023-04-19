import { PomlScreenSpaceElement } from 'ts-poml'
import { SpirareNodeBase } from './spirareNodeBase'
import { CreateNodeParams } from './spirareNode'
import { CameraSpaceType } from '../types'

export class SpirareScreenSpaceNode extends SpirareNodeBase<PomlScreenSpaceElement> {
  private constructor(
    element: PomlScreenSpaceElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(element, params, name)
  }

  protected override get cameraSpaceTypeSelf(): CameraSpaceType {
    return 'screen-space'
  }

  public static async create(
    element: PomlScreenSpaceElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareScreenSpaceNode> {
    return new SpirareScreenSpaceNode(element, params, name)
  }
}
