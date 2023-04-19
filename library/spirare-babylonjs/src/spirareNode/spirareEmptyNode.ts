import { PomlEmptyElement } from 'ts-poml'
import { SpirareNodeBase } from './spirareNodeBase'
import { CreateNodeParams } from './spirareNode'

export class SpirareEmptyNode extends SpirareNodeBase<PomlEmptyElement> {
  private constructor(
    emptyElement: PomlEmptyElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(emptyElement, params, name)
  }

  public static async create(
    emptyElement: PomlEmptyElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareEmptyNode> {
    return new SpirareEmptyNode(emptyElement, params, name)
  }
}
