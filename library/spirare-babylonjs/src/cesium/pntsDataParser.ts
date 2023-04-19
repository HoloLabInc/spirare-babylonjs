import { Vector3 } from '@babylonjs/core'

const textDecoder = new TextDecoder()

export class PntsDataParser {
  public static async parse(
    data: Uint8Array | File | Blob
  ): Promise<PntsData | undefined> {
    if (data instanceof File || data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer()
      data = new Uint8Array(arrayBuffer)
    }
    const pntsData = PntsDataParser.parseHeader(data)
    return pntsData
  }

  private static parseHeader(data: Uint8Array): PntsData | undefined {
    const headerLength = 28

    const view = new DataView(data.buffer)

    const magic: Uint8Array = data.slice(0, 4)
    if (!PntsDataParser.checkMagic(magic)) {
      throw new Error('invalid pnts file')
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

    const featureTableJson = textDecoder.decode(
      data.slice(headerLength, headerLength + featureTableJsonByteLength)
    )

    const globalSemantics = JSON.parse(featureTableJson) as PntsGlobalSemantics

    if (
      globalSemantics.POINTS_LENGTH === undefined ||
      globalSemantics.POSITION === undefined
    ) {
      return undefined
    }

    const length = globalSemantics.POINTS_LENGTH

    let positionArray: Float32Array
    let rgbArray: Uint8Array | undefined

    const featureTableBinaryOffset = headerLength + featureTableJsonByteLength
    {
      const offset =
        featureTableBinaryOffset + globalSemantics.POSITION.byteOffset
      const length = globalSemantics.POINTS_LENGTH * 3
      positionArray = new Float32Array(data.buffer, offset, length)
    }

    if (globalSemantics.RGB) {
      const offset = featureTableBinaryOffset + globalSemantics.RGB.byteOffset
      const length = globalSemantics.POINTS_LENGTH * 3
      rgbArray = new Uint8Array(data.buffer, offset, length)
    }

    let rtcCenter
    if (globalSemantics.RTC_CENTER) {
      var center = globalSemantics.RTC_CENTER
      rtcCenter = new Vector3(center[0], center[1], center[2])
    }

    return {
      length,
      positionArray,
      rgbArray,
      rtcCenter,
    }
  }

  private static checkMagic(magic: Uint8Array): Boolean {
    if (magic.length !== 4) {
      return false
    }
    // magic should be 'pnts' as ASCII
    return (
      magic[0] === 0x70 &&
      magic[1] === 0x6e &&
      magic[2] === 0x74 &&
      magic[3] === 0x73
    )
  }
}

export interface PntsData {
  length: number
  positionArray: Float32Array
  rgbArray?: Uint8Array
  rtcCenter?: Vector3
}

type PntsGlobalSemantics = {
  POINTS_LENGTH?: number
  RTC_CENTER?: [number, number, number]
  POSITION?: { byteOffset: number }
  RGB?: { byteOffset: number }
}
