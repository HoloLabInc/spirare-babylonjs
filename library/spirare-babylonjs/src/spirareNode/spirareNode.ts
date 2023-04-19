import { Scene, TransformNode } from '@babylonjs/core'
import { PomlElement } from 'ts-poml'
import { PomlElementStore } from '../pomlElementStore'
import { AssertTrue, IsNever } from './spirareNodeUtils'
import { SpirareNodeBase } from './spirareNodeBase'
import { SpirareModelNode } from './spirareModelNode'
import { SpirareTextNode } from './spirareTextNode'
import { SpirareCesium3dTilesNode } from './spirareCesium3dTilesNode'
import { SpirareGeometryNode } from './spirareGeometryNode'
import { SpirareImageNode } from './spirareImageNode'
import { SpirareVideoNode } from './spirareVideoNode'
import { SpirareEmptyNode } from './spirareEmptyNode'
import { SpirareScreenSpaceNode } from './spirareScreenSpaceNode'

export type SpirareNode<T extends PomlElement['type'] = PomlElement['type']> =
  T extends 'model'
    ? SpirareModelNode
    : T extends 'text'
    ? SpirareTextNode
    : T extends 'image'
    ? SpirareImageNode
    : T extends 'video'
    ? SpirareVideoNode
    : T extends 'element'
    ? SpirareEmptyNode
    : T extends 'geometry'
    ? SpirareGeometryNode
    : T extends 'cesium3dtiles'
    ? SpirareCesium3dTilesNode
    : T extends 'screen-space'
    ? SpirareScreenSpaceNode
    : never

export type CreateNodeParams = {
  scene: Scene
  store?: PomlElementStore
  parentNode?: SpirareNode
}

export async function createSpirareNode<T extends PomlElement>(
  pomlElement: T,
  params: CreateNodeParams
): Promise<SpirareNode<T['type']>> {
  // The return type is a static type of SpirareNode that corresponds to the static type of the input PomlElement.
  // (ex) If PomlTextElement is input, the return value is SpirareTextNode.

  let node: SpirareNode
  switch (pomlElement.type) {
    case 'model': {
      node = await SpirareModelNode.create(pomlElement, params)
      break
    }
    case 'text': {
      node = await SpirareTextNode.create(pomlElement, params)
      break
    }
    case 'image': {
      node = await SpirareImageNode.create(pomlElement, params)
      break
    }
    case 'video': {
      node = await SpirareVideoNode.create(pomlElement, params)
      break
    }
    case 'element': {
      node = await SpirareEmptyNode.create(pomlElement, params)
      break
    }
    case 'geometry': {
      node = await SpirareGeometryNode.create(pomlElement, params)
      break
    }
    case 'cesium3dtiles': {
      node = await SpirareCesium3dTilesNode.create(pomlElement, params)
      break
    }
    case 'screen-space': {
      node = await SpirareScreenSpaceNode.create(pomlElement, params)
      break
    }
  }
  return node as SpirareNode<T['type']>
}

export function isValidElementType(type: string): type is PomlElement['type'] {
  switch (type) {
    case 'model':
    case 'text':
    case 'image':
    case 'video':
    case 'element':
    case 'geometry':
    case 'cesium3dtiles':
    case 'screen-space': {
      // For static checking of implementation completeness.
      // Both never types mean correct implementation.
      type NotImplementedTypes = Exclude<PomlElement['type'], typeof type>
      type UnexpectedTypes = Exclude<typeof type, PomlElement['type']>

      // This line will cause a compile error if there are any missing or extra cases in the switch statement.
      let _: AssertTrue<IsNever<NotImplementedTypes>> &
        AssertTrue<IsNever<UnexpectedTypes>>

      return true
    }
    default: {
      return false
    }
  }
}

export function isSpirareNode(node: TransformNode): node is SpirareNode {
  if (node instanceof SpirareNodeBase) {
    const element = node.element
    if ('type' in element) {
      const type = (element as { type?: any }).type
      return typeof type === 'string' && isValidElementType(type)
    }
  }
  return false
}

export function findSpirareNodes(scene: Scene): SpirareNode[] {
  return scene.transformNodes
    .filter((n) => isSpirareNode(n))
    .map((n) => n as SpirareNode)
}

function findSpirareNode(
  scene: Scene,
  predicate: (node: SpirareNode) => boolean
): SpirareNode | undefined {
  const nodes = scene.transformNodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (isSpirareNode(node) && predicate(node)) {
      return node
    }
  }
  return undefined
}

export function findSpirareNodeById(
  scene: Scene,
  id: string
): SpirareNode | undefined {
  return findSpirareNode(scene, (node) => node.elementId === id)
}

export function findSpirareNodeByIncludedId(
  scene: Scene,
  id: string
): SpirareNode | undefined {
  return findSpirareNode(scene, (node) => node.includedId.includes(id))
}
