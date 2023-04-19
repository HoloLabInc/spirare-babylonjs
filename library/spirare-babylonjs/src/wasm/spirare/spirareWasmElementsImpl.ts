import { ElementInfo, PomlElementStore } from '../../pomlElementStore'
import { readUtf8, writeInt32 } from '../utilities/memoryHelper'
import { ErrorNo, ERROR_NO } from './spirareTypes'
import { getElementTypeNumber } from './spirareWasmUtils'

export const get_all_elements = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementInfoArrayPtr: number,
  arrayLen: number,
  writtenLenPtr: number
): ErrorNo => {
  const elementInfoArray = elementStore.GetAllElementInfo()
  const writeLen = Math.min(elementInfoArray.length, arrayLen)
  let elementInfoPtr = elementInfoArrayPtr
  for (let i = 0; i < writeLen; i++) {
    const elementInfo = elementInfoArray[i]
    if (writeElementInfo(memory, elementInfoPtr, elementInfo) === false) {
      // failed to write element info
      return ERROR_NO.InvalidArgument
    }

    // elementInfo is 8 byte
    elementInfoPtr += 8
  }

  if (writeInt32(memory, writtenLenPtr, writeLen)) {
    return ERROR_NO.Success
  } else {
    return ERROR_NO.InvalidArgument
  }
}

export const get_all_elements_len = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  elementsLenPtr: number
): ErrorNo => {
  const elementsLen = elementStore.GetAllElementsLength()
  if (writeInt32(memory, elementsLenPtr, elementsLen)) {
    return ERROR_NO.Success
  } else {
    return ERROR_NO.InvalidArgument
  }
}

export const get_element_by_id = (
  memory: ArrayBuffer,
  elementStore: PomlElementStore,
  idPtr: number,
  idLength: number,
  elementInfoPtr: number
): ErrorNo => {
  const result = readUtf8(memory, idPtr, idLength)
  if (result.success === false) {
    return ERROR_NO.InvalidArgument
  }

  const elementInfo = elementStore.GetElementInfoById(result.value)
  if (elementInfo === undefined) {
    return ERROR_NO.ElementNotFound
  }

  if (writeElementInfo(memory, elementInfoPtr, elementInfo)) {
    return ERROR_NO.Success
  } else {
    return ERROR_NO.InvalidArgument
  }
}

const writeElementInfo = (
  arrayBuffer: ArrayBuffer,
  offset: number,
  info: ElementInfo
): boolean => {
  const elementType = getElementTypeNumber(info.node)
  return (
    writeInt32(arrayBuffer, offset, info.elementDescriptor) &&
    writeInt32(arrayBuffer, offset + 4, elementType)
  )
}
