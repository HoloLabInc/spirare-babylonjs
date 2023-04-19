import { describe, test, expect } from '@jest/globals'
import {
  readByte,
  readFloat32,
  readInt32,
  readUtf8,
  writeByte,
  writeBytes,
  writeInt32,
  writeInt64,
} from '../../src/wasm/utilities/memoryHelper'

describe('memory helper', (): void => {
  test('readByte_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Uint8Array(memory, 0)

    array[0] = 100
    array[255] = 240

    {
      const result = readByte(memory, 0)
      expect(result).toStrictEqual({ success: true, value: 100 })
    }
    {
      const result = readByte(memory, 255)
      expect(result).toStrictEqual({ success: true, value: 240 })
    }
  })

  test('readByte_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = readByte(memory, -1)
      expect(result).toStrictEqual({ success: false })
    }
    {
      const result = readByte(memory, 256)
      expect(result).toStrictEqual({ success: false })
    }
  })

  test('readInt32_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Int32Array(memory, 0)

    array[0] = 12345
    array[63] = -1

    {
      const result = readInt32(memory, 0)
      expect(result).toStrictEqual({ success: true, value: 12345 })
    }
    {
      const result = readInt32(memory, 252)
      expect(result).toStrictEqual({ success: true, value: -1 })
    }
  })

  test('readInt32_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = readInt32(memory, -1)
      expect(result).toStrictEqual({ success: false })
    }
    {
      const result = readInt32(memory, 253)
      expect(result).toStrictEqual({ success: false })
    }
  })

  test('readFloat32_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Float32Array(memory, 0)

    array[0] = 0.25
    array[63] = -1

    {
      const result = readFloat32(memory, 0)
      expect(result).toStrictEqual({ success: true, value: 0.25 })
    }
    {
      const result = readFloat32(memory, 252)
      expect(result).toStrictEqual({ success: true, value: -1 })
    }
  })

  test('readFloat32_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = readFloat32(memory, -1)
      expect(result).toStrictEqual({ success: false })
    }
    {
      const result = readFloat32(memory, 253)
      expect(result).toStrictEqual({ success: false })
    }
  })

  test('readUtf8_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Uint8Array(memory, 0)

    array[0] = 'a'.charCodeAt(0)
    array[255] = 'Z'.charCodeAt(0)

    {
      const result = readUtf8(memory, 0, 1)
      expect(result).toStrictEqual({ success: true, value: 'a' })
    }
    {
      const result = readUtf8(memory, 255, 1)
      expect(result).toStrictEqual({ success: true, value: 'Z' })
    }
  })

  test('readUtf8_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = readUtf8(memory, -1, 1)
      expect(result).toStrictEqual({ success: false })
    }
    {
      const result = readUtf8(memory, 255, 2)
      expect(result).toStrictEqual({ success: false })
    }
  })

  test('writeByte_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Uint8Array(memory, 0)

    {
      const result = writeByte(memory, 0, 100)
      expect(result).toBeTruthy()
      expect(array[0]).toBe(100)
    }
    {
      const result = writeByte(memory, 5, 240)
      expect(result).toBeTruthy()
      expect(array[5]).toBe(240)
    }
    {
      const result = writeByte(memory, 255, 1)
      expect(result).toBeTruthy()
      expect(array[255]).toBe(1)
    }
  })

  test('writeByte_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = writeByte(memory, -1, 100)
      expect(result).toBeFalsy()
    }
    {
      const result = writeByte(memory, 256, 1)
      expect(result).toBeFalsy()
    }
  })

  test('writeBytes_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Uint8Array(memory, 0)

    {
      const data = new ArrayBuffer(10)
      const dataArray = new Uint8Array(data, 0)
      dataArray[0] = 1
      dataArray[9] = 10
      const result = writeBytes(memory, 0, dataArray)
      expect(result).toBeTruthy()
      expect(array[0]).toBe(1)
      expect(array[9]).toBe(10)
    }
    {
      const data = new ArrayBuffer(10)
      const dataArray = new Uint8Array(data, 0)
      dataArray[0] = 1
      dataArray[9] = 10
      const result = writeBytes(memory, 246, dataArray)
      expect(result).toBeTruthy()
      expect(array[246]).toBe(1)
      expect(array[255]).toBe(10)
    }
  })

  test('writeBytes_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const data = new ArrayBuffer(10)
      const dataArray = new Uint8Array(data, 0)
      dataArray[0] = 1
      dataArray[9] = 10
      const result = writeBytes(memory, -1, dataArray)
      expect(result).toBeFalsy()
    }
    {
      const data = new ArrayBuffer(10)
      const dataArray = new Uint8Array(data, 0)
      dataArray[0] = 1
      dataArray[9] = 10
      const result = writeBytes(memory, 247, dataArray)
      expect(result).toBeFalsy()
    }
  })

  test('writeInt32_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new Int32Array(memory, 0)

    {
      const result = writeInt32(memory, 0, 10000)
      expect(result).toBeTruthy()
      expect(array[0]).toBe(10000)
    }
    {
      const result = writeInt32(memory, 252, -1)
      expect(result).toBeTruthy()
      expect(array[63]).toBe(-1)
    }
  })

  test('writeInt32_Failure', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)

    {
      const result = writeInt32(memory, -1, 10000)
      expect(result).toBeFalsy()
    }
    {
      const result = writeInt32(memory, 253, -1)
      expect(result).toBeFalsy()
    }
  })

  test('writeInt64_Success', (): void => {
    const memoryLength = 256
    const memory = new ArrayBuffer(memoryLength)
    const array = new BigInt64Array(memory, 0)

    {
      const result = writeInt64(memory, 1 * 8, BigInt(10000))
      expect(result).toBeTruthy()
      expect(array[1]).toBe(BigInt(10000))
    }
    {
      const result = writeInt64(memory, 3 * 8, BigInt(-1))
      expect(result).toBeTruthy()
      expect(array[3]).toBe(BigInt(-1))
    }
  })
})
