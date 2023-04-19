import { Nullable, Scene, TransformNode, Vector3 } from '@babylonjs/core'
import {
  GLTFLoader,
  IGLTFLoaderExtension,
  INode,
} from '@babylonjs/loaders/glTF/2.0'
import { B3dmLocation } from './b3dmDataParser'

export class CesiumRTC implements IGLTFLoaderExtension {
  private static readonly extensionName: string = 'CESIUM_RTC'
  private static isLoaderRegistered: boolean

  private static uniqueIdToEcefDic: {
    [uniqueId: number]: Vector3 | undefined
  } = {}

  private getTransformNode: () => TransformNode | undefined = () => undefined

  private loader: GLTFLoader | undefined
  public name: string = CesiumRTC.extensionName
  public enabled: boolean = true

  constructor(loader: GLTFLoader) {
    this.loader = loader

    loader.babylonScene.meshes.length - 1
  }

  dispose(): void {
    this.loader = undefined
  }

  public loadNodeAsync?(
    context: string,
    node: INode,
    assign: (babylonMesh: TransformNode) => void
  ): Nullable<Promise<TransformNode>> {
    // Here, the TransformNode cannot be obtained yet.
    // It needs to be obtained after loading.
    this.getTransformNode = () => node._babylonTransformNode
    return null
  }

  public onReady() {
    const loader = this.loader
    if (!loader) {
      return
    }

    const extensions = loader.gltf.extensions
    if (!extensions) {
      return
    }
    const cesiumRtc = extensions['CESIUM_RTC']
    if (!('center' in cesiumRtc)) {
      throw new Error(`'CESIUM_RTC' extensions has no property 'center'.`)
    }

    if (!(cesiumRtc.center instanceof Array) || cesiumRtc.center.length !== 3) {
      throw new Error(`'center' property is not array with length 3.`)
    }
    const x = cesiumRtc.center[0]
    const y = cesiumRtc.center[1]
    const z = cesiumRtc.center[2]
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof z !== 'number'
    ) {
      throw new Error(`'center' is not ['number', 'number', 'number'].`)
    }
    const node = this.getTransformNode()
    const location: B3dmLocation = {
      b3dmEcef: new Vector3(x, y, z),
    }
    if (node) {
      Object.assign(node, location)
    }
  }

  /**
   * Get ECEF coordinate data from the uniqueId of TransformNode
   * @static
   * @param {Scene} scene Target scene
   * @param {number} uniqueId UniqueId of TransformNode
   * @return {*}  {(Vector3 | undefined)} ECEF coordinates. Undefined if it does not exist.
   * @memberof CesiumRTC
   */
  public static getEcef(scene: Scene, uniqueId: number): Vector3 | undefined {
    return CesiumRTC.uniqueIdToEcefDic[uniqueId]
  }

  public static RegisterLoader() {
    if (CesiumRTC.isLoaderRegistered) {
      return
    }
    GLTFLoader.RegisterExtension(
      CesiumRTC.extensionName,
      (loader) => new CesiumRTC(loader)
    )
    CesiumRTC.isLoaderRegistered = true
  }
}
