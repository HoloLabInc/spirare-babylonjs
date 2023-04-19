import { writeByte, writeBytes, writeInt32 } from '../utilities/memoryHelper'

export const stringListWriterFactory = (textList: string[]) => {
  const textEncoder = new TextEncoder()
  const textBytes = textList.map((x) => textEncoder.encode(x))
  const textBufferSize = textBytes.reduce(
    (sum, bytes) => sum + bytes.length + 1,
    0
  )

  const writeStringList = (
    memory: ArrayBuffer,
    offset: number,
    bufferOffset: number
  ): boolean => {
    for (const textByte of textBytes) {
      if (writeInt32(memory, offset, bufferOffset) == false) {
        return false
      }

      offset += 4

      // write string
      if (writeBytes(memory, bufferOffset, textByte) == false) {
        return false
      }
      bufferOffset += textByte.length

      // write null character
      if (writeByte(memory, bufferOffset, 0) == false) {
        return false
      }
      bufferOffset += 1
    }

    return true
  }

  const writeStringListLength = (
    memory: ArrayBuffer,
    sizePtr: number,
    bufferSizePtr: number
  ): boolean => {
    return (
      writeInt32(memory, sizePtr, textList.length) &&
      writeInt32(memory, bufferSizePtr, textBufferSize)
    )
  }

  return { writeStringList, writeStringListLength }
}
