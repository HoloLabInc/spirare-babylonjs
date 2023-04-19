import { SpirareNode } from './spirareNode/spirareNode'

const initialElementDescriptor = 10

export class PomlElementStore {
  private elements: ElementInfo[] = []
  private elementDescriptor: number = initialElementDescriptor

  public RegisterElement(node: SpirareNode) {
    const info: ElementInfo = {
      id: node.element.id,
      node: node,
      elementDescriptor: this.elementDescriptor,
    }
    this.elements.push(info)

    this.elementDescriptor += 1
  }

  public GetAllElementsLength() {
    return this.elements.length
  }

  public GetAllElementInfo() {
    return this.elements
  }

  public GetElementInfoById(id: string) {
    return this.elements.find((x) => x.id === id)
  }

  public GetNodeByElementDescriptor(elementDescriptor: number) {
    return this.elements.find((x) => x.elementDescriptor == elementDescriptor)
      ?.node
  }

  public GetElementDescriptorBySpirareNode(node: SpirareNode) {
    return this.elements.find((x) => x.node === node)?.elementDescriptor
  }
}

export type ElementInfo = {
  id: string | undefined
  node: SpirareNode
  elementDescriptor: number
}
