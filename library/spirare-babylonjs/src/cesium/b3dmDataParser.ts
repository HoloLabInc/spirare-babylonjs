import { Vector3 } from '@babylonjs/core'
import { CesiumRTC } from './cesiumRTC'

export class B3dmDataParser {
  public static async parse(data: Uint8Array | File | Blob): Promise<B3dmData> {
    if (data instanceof File || data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer()
      data = new Uint8Array(arrayBuffer)
    }
    CesiumRTC.RegisterLoader()
    const b3dmData = B3dmDataParser.parseHeader(data)
    return b3dmData
  }

  private static parseHeader(data: Uint8Array): B3dmData {
    const headerLength = 28

    const view = new DataView(data.buffer)

    const magic: Uint8Array = data.slice(0, 4)
    if (!B3dmDataParser.checkMagic(magic)) {
      throw new Error('invalid b3dm file')
    }
    const version: number = view.getUint32(4, true)
    const byteLength: number = view.getUint32(8, true)

    const featureTableJsonByteLength: number = view.getUint32(12, true)
    const featureTableBinaryByteLength: number = view.getUint32(16, true)
    const batchTableJsonByteLength: number = view.getUint32(20, true)
    const batchTableBinaryByteLength: number = view.getUint32(24, true)

    const tableByteLength =
      featureTableJsonByteLength +
      featureTableBinaryByteLength +
      batchTableJsonByteLength +
      batchTableBinaryByteLength

    const glbOffset = headerLength + tableByteLength
    const glbByteLength: number = byteLength - headerLength - tableByteLength
    const glbBlob = new Blob([
      data.subarray(glbOffset, glbOffset + glbByteLength),
    ])
    return {
      glbOffset: glbOffset,
      glbByteLength: glbByteLength,
      glbBlob: glbBlob,
    }
  }

  private static checkMagic(magic: Uint8Array): Boolean {
    if (magic.length !== 4) {
      return false
    }
    // magic should be 'b3dm' as ASCII
    return (
      magic[0] === 0x62 &&
      magic[1] === 0x33 &&
      magic[2] === 0x64 &&
      magic[3] === 0x6d
    )
  }
}

export interface B3dmData {
  glbOffset: number
  glbByteLength: number
  glbBlob: Blob
}

export interface B3dmLocation {
  b3dmEcef: Vector3
}

export function implementsB3dmLocation(arg: any): arg is B3dmLocation {
  return (
    arg !== null && typeof arg === 'object' && arg.b3dmEcef instanceof Vector3
  )
}
