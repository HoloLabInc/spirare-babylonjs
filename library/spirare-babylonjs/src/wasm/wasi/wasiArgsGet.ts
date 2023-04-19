import { stringListWriterFactory } from './wasiStringListWriter'
import { ErrorNo, ERROR_NO } from './wasiTypes'

export const argsGetFactory = (args: string[]) => {
  const { writeStringListLength, writeStringList } =
    stringListWriterFactory(args)

  const argsSizesGet = (
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

  const argsGet = (
    memory: ArrayBuffer,
    argvPtr: number,
    argvBufPtr: number
  ): ErrorNo => {
    if (writeStringList(memory, argvPtr, argvBufPtr)) {
      return ERROR_NO.Success
    } else {
      return ERROR_NO.Inval
    }
  }

  return { argsSizesGet, argsGet }
}
