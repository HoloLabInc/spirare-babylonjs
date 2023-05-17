import { PomlUnknown } from 'ts-poml'
import { CreateNodeParams } from './spirareNode'
import { TransformNode } from '@babylonjs/core'

export class SpirareUnknownNode extends TransformNode {
  private _element: PomlUnknown
  private constructor(
    element: PomlUnknown,
    params: CreateNodeParams,
    name?: string
  ) {
    super(name ?? element.type, params.scene)
    this._element = element
    console.log(element._original)
  }

  public get element(): PomlUnknown {
    return this._element
  }

  public get type(): '?' {
    return this._element.type
  }

  public static async create(
    element: PomlUnknown,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareUnknownNode> {
    return new SpirareUnknownNode(element, params, name)
  }
}
