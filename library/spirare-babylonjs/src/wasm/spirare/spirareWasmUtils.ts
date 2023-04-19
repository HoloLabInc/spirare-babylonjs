import { Color4 } from '@babylonjs/core'
import { Position, Rotation, Scale } from 'ts-poml'
import { SpirareNode } from '../../spirareNode/spirareNode'
import {
  readFloat32,
  Result,
  writeBytes,
  writeFloat32,
  writeInt32,
} from '../utilities/memoryHelper'
import { ErrorNo, ERROR_NO } from './spirareTypes'

const writeFloat32Array = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  array: number[]
): boolean => {
  return array
    .map((value, index) => writeFloat32(arrayBuffer, offset + index * 4, value))
    .every(Boolean)
}

const readFloat32Array = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  arrayLen: number
): Result<number[]> => {
  let value = []
  for (let i = 0; i < arrayLen; i++) {
    const result = readFloat32(arrayBuffer, offset + i * 4)
    if (result.success === false) {
      return { success: false }
    }
    value.push(result.value)
  }

  return {
    success: true,
    value: value,
  }
}

const textEncoder = new TextEncoder()

export const writeString = (
  memory: ArrayBuffer,
  text: string | undefined,
  textPtr: number,
  textBufferLen: number
): ErrorNo => {
  const textBytes = textEncoder.encode(text)

  if (textBufferLen < textBytes.length) {
    return ERROR_NO.InsufficientBufferSize
  }

  if (writeBytes(memory, textPtr, textBytes)) {
    return ERROR_NO.Success
  } else {
    return ERROR_NO.InvalidArgument
  }
}

export const writeStringLen = (
  memory: ArrayBuffer,
  text: string | undefined,
  textPtr: number
): ErrorNo => {
  const textBytes = textEncoder.encode(text)

  if (writeInt32(memory, textPtr, textBytes.length)) {
    return ERROR_NO.Success
  } else {
    return ERROR_NO.InvalidArgument
  }
}

export const writeColor = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  color: Color4
): boolean => {
  const array = [color.r, color.g, color.b, color.a]
  return writeFloat32Array(arrayBuffer, offset, array)
}

export const readColor = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<Color4> => {
  const result = readFloat32Array(arrayBuffer, offset, 4)
  if (result.success) {
    const array = result.value
    return {
      success: true,
      value: new Color4(array[0], array[1], array[2], array[3]),
    }
  } else {
    return { success: false }
  }
}

export const writePosition = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  position: Position
): boolean => {
  const array = [position.x, position.y, position.z]
  return writeFloat32Array(arrayBuffer, offset, array)
}

export const readPosition = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<Position> => {
  const result = readFloat32Array(arrayBuffer, offset, 3)
  if (result.success) {
    const array = result.value
    return {
      success: true,
      value: { x: array[0], y: array[1], z: array[2] },
    }
  } else {
    return { success: false }
  }
}

export const writeRotation = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  rotation: Rotation
): boolean => {
  const array = [rotation.x, rotation.y, rotation.z, rotation.w]
  return writeFloat32Array(arrayBuffer, offset, array)
}

export const readRotation = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<Rotation> => {
  const result = readFloat32Array(arrayBuffer, offset, 4)
  if (result.success) {
    const array = result.value
    return {
      success: true,
      value: { x: array[0], y: array[1], z: array[2], w: array[3] },
    }
  } else {
    return { success: false }
  }
}

export const writeScale = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  scale: Scale
): boolean => {
  let array
  if (typeof scale === 'number') {
    array = [scale, scale, scale]
  } else {
    array = [scale.x, scale.y, scale.z]
  }
  return writeFloat32Array(arrayBuffer, offset, array)
}

export const readScale = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<Scale> => {
  const result = readFloat32Array(arrayBuffer, offset, 3)
  if (result.success) {
    const array = result.value
    return {
      success: true,
      value: { x: array[0], y: array[1], z: array[2] },
    }
  } else {
    return { success: false }
  }
}

export const getElementTypeNumber = (node: SpirareNode): number => {
  switch (node.type) {
    case 'element':
      return 1
    case 'model':
      return 2
    case 'text':
      return 3
    case 'image':
      return 4
    case 'video':
      return 5
    // case 'audio':
    //  return 6
    case 'geometry':
      return 7
    case 'cesium3dtiles':
      return 8
    case 'screen-space':
      return 12
    default:
      const unreachable: never = node
      break
  }

  return 0
}
