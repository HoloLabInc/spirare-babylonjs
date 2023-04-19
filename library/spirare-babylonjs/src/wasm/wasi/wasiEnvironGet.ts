import { stringListWriterFactory } from './wasiStringListWriter'
import { ErrorNo, ERROR_NO } from './wasiTypes'

export const environGetFactory = (envs: Map<string, string>) => {
  const envArray = [...envs.entries()].map(([key, value]) => `${key}=${value}`)
  const { writeStringListLength, writeStringList } = stringListWriterFactory(envArray)

  const environSizesGet = (
    memory: ArrayBuffer,
    sizePtr: number,
    bufferSizePtr: number
  ): ErrorNo => {
    if (writeStringListLength(memory, sizePtr, bufferSizePtr)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.Inval
    }
  }

  const environGet = (
    memory: ArrayBuffer,
    environPtr: number,
    environBufPtr: number
  ): ErrorNo => {
    if (writeStringList(memory, environPtr, environBufPtr)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.Inval
    }
  }

  return { environSizesGet, environGet }
}
