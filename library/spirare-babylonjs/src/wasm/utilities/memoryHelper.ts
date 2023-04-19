export type Result<T> =
  | {
      success: true
      value: T
    }
  | {
      success: false
    }

const Failure: Result<any> = { success: false }

export const readByte = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<number> => {
  if (isValidAccess(arrayBuffer, offset, 1)) {
    const dataView = new DataView(arrayBuffer)
    const value = dataView.getUint8(offset)
    return { success: true, value: value }
  } else {
    return Failure
  }
}

export const readInt32 = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<number> => {
  if (isValidAccess(arrayBuffer, offset, 4)) {
    const dataView = new DataView(arrayBuffer)
    const value = dataView.getInt32(offset, true)
    return { success: true, value: value }
  } else {
    return Failure
  }
}

export const readFloat32 = (
  arrayBuffer: ArrayBuffer,
  offset: number
): Result<number> => {
  if (isValidAccess(arrayBuffer, offset, 4)) {
    const dataView = new DataView(arrayBuffer)
    const value = dataView.getFloat32(offset, true)
    return { success: true, value: value }
  } else {
    return Failure
  }
}

export const readUtf8 = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  length: number
): Result<string> => {
  if (isValidAccess(arrayBuffer, offset, length)) {
    const textArray = new Uint8Array(arrayBuffer, offset, length)
    const textDecoder = new TextDecoder()
    const text = textDecoder.decode(textArray)
    return { success: true, value: text }
  } else {
    return Failure
  }
}

export const readVectoredBufferText = (
  arrayBuffer: ArrayBuffer,
  iovs: number,
  iovsLen: number
): Result<{ text: string; length: number }> => {
  // TODO: check access range
  const result = getVectoredBufferSlice(arrayBuffer, iovs, iovsLen)
  if (result.success === false) {
    return Failure
  }

  const bufferArray = result.value

  const length = bufferArray.reduce((sum, x) => sum + x.length, 0)
  const mergedArray = new Uint8Array(length)

  let offset = 0
  bufferArray.forEach((x) => {
    mergedArray.set(x, offset)
    offset += x.length
  })

  const textDecoder = new TextDecoder()
  const text = textDecoder.decode(mergedArray)
  return { success: true, value: { text: text, length: length } }
}

const getVectoredBufferSlice = (
  arrayBuffer: ArrayBuffer,
  iovs: number,
  iovsLen: number
): Result<Uint8Array[]> => {
  // TODO: check access range
  const bufferArray = []
  const dataView = new DataView(arrayBuffer)
  for (var i = 0; i < iovsLen; i++) {
    const startOffset = dataView.getUint32(iovs + i * 8, true)
    const length = dataView.getUint32(iovs + i * 8 + 4, true)
    const buf = new Uint8Array(arrayBuffer, startOffset, length)
    bufferArray.push(buf)
  }
  return { success: true, value: bufferArray }
}

export const writeByte = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: number
): boolean => {
  if (isValidAccess(arrayBuffer, offset, 1)) {
    const dataView = new DataView(arrayBuffer)
    dataView.setUint8(offset, value)
    return true
  } else {
    return false
  }
}

export const writeBytes = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: Uint8Array
): boolean => {
  if (isValidAccess(arrayBuffer, offset, value.byteLength)) {
    const array = new Uint8Array(arrayBuffer, offset)
    array.set(value)
    return true
  } else {
    return false
  }
}

export const writeInt32 = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: number
): boolean => {
  if (isValidAccess(arrayBuffer, offset, 4)) {
    const dataView = new DataView(arrayBuffer)
    dataView.setInt32(offset, value, true)
    return true
  } else {
    return false
  }
}

export const writeInt64 = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: bigint
): boolean => {
  if (isValidAccess(arrayBuffer, offset, 8)) {
    const dataView = new DataView(arrayBuffer)
    dataView.setBigInt64(offset, value, true)
    return true
  } else {
    return false
  }
}

export const writeFloat32 = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: number
): boolean => {
  if (isValidAccess(arrayBuffer, offset, 4)) {
    const dataView = new DataView(arrayBuffer)
    dataView.setFloat32(offset, value, true)
    return true
  } else {
    return false
  }
}

export const writeUtf8 = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  value: string
): number | undefined => {
  const textArray = new Uint8Array(arrayBuffer, offset)
  const textEncoder = new TextEncoder()
  const result = textEncoder.encodeInto(value, textArray)
  return result.written
}

const isValidAccess = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  size: number
): boolean => {
  const byteLength = arrayBuffer.byteLength
  if (0 <= offset && offset + size <= byteLength) {
    return true
  }
  return false
}
