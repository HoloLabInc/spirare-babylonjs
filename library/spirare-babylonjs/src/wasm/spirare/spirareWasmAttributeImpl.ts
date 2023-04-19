import { Display } from 'ts-poml'
import { stringToColor } from '../../colorUtil'
import { PomlElementStore } from '../../pomlElementStore'
import { SpirareModelNode } from '../../spirareNode/spirareModelNode'
import { SpirareNode } from '../../spirareNode/spirareNode'
import { readUtf8, writeInt32 } from '../utilities/memoryHelper'
import {
  AnimationState,
  AnimationWrap,
  ErrorNo,
  ERROR_NO,
} from './spirareTypes'
import {
  readColor,
  readPosition,
  readRotation,
  readScale,
  writeColor,
  writePosition,
  writeRotation,
  writeScale,
  writeString,
  writeStringLen,
} from './spirareWasmUtils'

export const get_id = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  idPtr: number,
  idLen: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const id = node.elementId
    return writeString(memory, id, idPtr, idLen)
  })
}

export const get_id_len = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  idLenPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const id = node.elementId
    return writeStringLen(memory, id, idLenPtr)
  })
}

export const get_display = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  displayPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const display = node.element.display ?? 'visible'
    const displayNum = displayToNum(display)
    if (writeInt32(memory, displayPtr, displayNum)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const set_display = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  displayNum: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, () => {
    const display = numToDisplay(displayNum)
    if (display === undefined) {
      return ERROR_NO.InvalidArgument
    }

    return { display }
  })
}

export const get_position = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  positionPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const position = node.element.position ?? { x: 0, y: 0, z: 0 }
    if (writePosition(memory, positionPtr, position)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const set_position = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  positionPtr: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, () => {
    const result = readPosition(memory, positionPtr)
    if (result.success === false) {
      return ERROR_NO.InvalidArgument
    }

    return { position: result.value }
  })
}

export const get_rotation = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  rotationPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const rotation = node.element.rotation ?? { x: 0, y: 0, z: 0, w: 1 }
    if (writeRotation(memory, rotationPtr, rotation)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const set_rotation = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  rotationPtr: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, () => {
    const result = readRotation(memory, rotationPtr)
    if (result.success === false) {
      return ERROR_NO.InvalidArgument
    }

    return { rotation: result.value }
  })
}

export const get_scale = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  scalePtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    const scale = node.element.scale ?? 1
    if (writeScale(memory, scalePtr, scale)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const set_scale = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  scalePtr: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, () => {
    const result = readScale(memory, scalePtr)
    if (result.success === false) {
      return ERROR_NO.InvalidArgument
    }

    return { scale: result.value }
  })
}

export const get_text = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  textPtr: number,
  textBufferLen: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    if (node.type === 'text') {
      const text = node.text
      return writeString(memory, text, textPtr, textBufferLen)
    } else {
      return ERROR_NO.UnsupportedOperation
    }
  })
}

export const get_text_len = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  textLenPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    if (node.type === 'text') {
      const text = node.text
      return writeStringLen(memory, text, textLenPtr)
    } else {
      return ERROR_NO.UnsupportedOperation
    }
  })
}

export const set_text = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  textPtr: number,
  textLength: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, (node) => {
    const result = readUtf8(memory, textPtr, textLength)
    if (result.success === false) {
      return ERROR_NO.InvalidArgument
    }

    if (node.type === 'text') {
      return { text: result.value }
    } else {
      return ERROR_NO.UnsupportedOperation
    }
  })
}

export const get_background_color = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  colorPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    if ('backgroundColor' in node) {
      const color = stringToColor(node.backgroundColor)
      if (writeColor(memory, colorPtr, color)) {
        return ERROR_NO.Success
      } else {
        return ERROR_NO.InvalidArgument
      }
    } else {
      return ERROR_NO.UnsupportedOperation
    }
  })
}

export const set_background_color = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  colorPtr: number
): ErrorNo => {
  return setAttribute(elementStore, elementDescriptor, (node) => {
    if (node.type === 'text') {
      const result = readColor(memory, colorPtr)

      if (result.success) {
        const backgroundColor = result.value.toHexString()
        return { backgroundColor }
      } else {
        return ERROR_NO.InvalidArgument
      }
    } else {
      return ERROR_NO.UnsupportedOperation
    }
  })
}

// Animation
export const change_anim = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  animationIndex: number,
  playNumber: number,
  wrapNumber: number
): ErrorNo => {
  return changeSpirareModelNode(elementStore, elementDescriptor, (node) => {
    const animationState = numToAnimationState(playNumber)
    if (animationState === undefined) {
      return ERROR_NO.InvalidArgument
    }

    const wrap = numToAnimationWrap(wrapNumber)
    if (wrap === undefined) {
      return ERROR_NO.InvalidArgument
    }

    const play = animationState === 'play'
    const result = node.changeAnimationByIndex(animationIndex, wrap, play)
    if (result) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const change_anim_by_name = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  animationNamePtr: number,
  animationNameLength: number,
  playNumber: number,
  wrapNumber: number
): ErrorNo => {
  return changeSpirareModelNode(elementStore, elementDescriptor, (node) => {
    const animationNameResult = readUtf8(
      memory,
      animationNamePtr,
      animationNameLength
    )
    if (animationNameResult.success === false) {
      return ERROR_NO.InvalidArgument
    }
    const animationName = animationNameResult.value

    const animationState = numToAnimationState(playNumber)
    if (animationState === undefined) {
      return ERROR_NO.InvalidArgument
    }

    const wrap = numToAnimationWrap(wrapNumber)
    if (wrap === undefined) {
      return ERROR_NO.InvalidArgument
    }

    const play = animationState === 'play'
    const result = node.changeAnimationByName(animationName, wrap, play)
    if (result) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const get_anim_state = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  animationStatePtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    if (node.type !== 'model') {
      return ERROR_NO.UnsupportedOperation
    }
    const animationState = node.getAnimationState()
    const animationStateNum = animationStateToNum(animationState)
    if (writeInt32(memory, animationStatePtr, animationStateNum)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

export const set_anim_state = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  animationStateNum: number
): ErrorNo => {
  return changeSpirareModelNode(elementStore, elementDescriptor, (node) => {
    const animationState = numToAnimationState(animationStateNum)
    if (animationState === undefined) {
      return ERROR_NO.InvalidArgument
    }

    node.setAnimationState(animationState)
    return ERROR_NO.Success
  })
}

export const get_current_anim = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementDescriptor: number,
  animationIndexPtr: number
): ErrorNo => {
  return getAttribute(elementStore, elementDescriptor, (node) => {
    if (node.type !== 'model') {
      return ERROR_NO.UnsupportedOperation
    }
    const animationIndex = node.getCurerntAnimationIndex()

    if (animationIndex === undefined) {
      const invalidAnimationIndex = 0
      writeInt32(memory, animationIndexPtr, invalidAnimationIndex)
      return ERROR_NO.InvalidArgument
    }

    if (writeInt32(memory, animationIndexPtr, animationIndex)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.InvalidArgument
    }
  })
}

const getAttribute = (
  elementStore: PomlElementStore,
  elementDescriptor: number,
  writeAttribute: (node: SpirareNode) => ErrorNo
): ErrorNo => {
  const node = elementStore.GetNodeByElementDescriptor(elementDescriptor)

  // element node not found
  if (node === undefined) {
    return ERROR_NO.ElementNotFound
  }

  return writeAttribute(node)
}

const setAttribute = (
  elementStore: PomlElementStore,
  elementDescriptor: number,
  getAttributes: (node: SpirareNode) => object | ErrorNo
): ErrorNo => {
  const node = elementStore.GetNodeByElementDescriptor(elementDescriptor)

  // element node not found
  if (node === undefined) {
    return ERROR_NO.ElementNotFound
  }

  const result = getAttributes(node)
  if (typeof result === 'number') {
    return result
  }

  node.updateData({ ...result, id: node.elementId })
  return ERROR_NO.Success
}

const changeSpirareModelNode = (
  elementStore: PomlElementStore,
  elementDescriptor: number,
  changeSpirareModelNodeFunc: (node: SpirareModelNode) => ErrorNo
): ErrorNo => {
  const node = elementStore.GetNodeByElementDescriptor(elementDescriptor)

  // element node not found
  if (node === undefined) {
    return ERROR_NO.ElementNotFound
  }

  if (node.type !== 'model') {
    return ERROR_NO.UnsupportedOperation
  }

  return changeSpirareModelNodeFunc(node)
}

const numToDisplay = (value: number): Display | undefined => {
  switch (value) {
    case 0:
      return 'visible'
    case 1:
      return 'none'
    case 2:
      return 'occlusion'
    default:
      return undefined
  }
}

const displayToNum = (display: Display): number => {
  switch (display) {
    case 'visible':
      return 0
    case 'none':
      return 1
    case 'occlusion':
      return 2
    default:
      const unreachable: never = display
      return unreachable
  }
}

const numToAnimationState = (value: number): AnimationState | undefined => {
  switch (value) {
    case 0:
      return 'stop'
    case 1:
      return 'play'
    default:
      return undefined
  }
}

const animationStateToNum = (value: AnimationState): number => {
  switch (value) {
    case 'stop':
      return 0
    case 'play':
      return 1
  }
}

const numToAnimationWrap = (value: number): AnimationWrap | undefined => {
  switch (value) {
    case 0:
      return 'once'
    case 1:
      return 'loop'
    default:
      return undefined
  }
}
