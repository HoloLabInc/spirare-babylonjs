import { readVectoredBufferText, writeInt32 } from '../utilities/memoryHelper'
import { ErrorNo, ERROR_NO } from './wasiTypes'

export const fd_write = (
  memory: ArrayBuffer,
  fd: number,
  iovs: number,
  iovsLen: number,
  nwrittenPtr: number
): ErrorNo => {
  const result = readVectoredBufferText(memory, iovs, iovsLen)
  if (result.success === false) {
    return ERROR_NO.Inval
  }

  const { text, length } = result.value

  switch (fd) {
    case 1:
      console.log(text)
      break
    case 2:
      console.error(text)
      break
  }

  if (writeInt32(memory, nwrittenPtr, length) == false) {
    return ERROR_NO.Inval
  }

  return ERROR_NO.Success
}

export const fd_prestat_get = (
  memory: ArrayBuffer,
  fd: number,
  resultPtr: number
): ErrorNo => {
  return ERROR_NO.Badf
}
