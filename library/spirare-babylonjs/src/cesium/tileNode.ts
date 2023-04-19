import { Scene, TransformNode, Vector3 } from '@babylonjs/core'
import { GeoCoordUtil } from './geoCoordUtil'
import { GeoManager, OnOriginChangedEventListener } from './geoManager'

export class TileNode extends TransformNode {
  private _originEcef: Vector3 | undefined

  public get originEcef() {
    return this._originEcef
  }

  public set originEcef(value: Vector3 | undefined) {
    this._originEcef = value
    this.updateGeoplacement()
  }

  private geoManager: GeoManager

  constructor(geoManager: GeoManager, scene: Scene, name?: string) {
    name = name ?? 'Tile'
    super(name, scene)

    this.geoManager = geoManager

    const onOriginChangedEventListener: OnOriginChangedEventListener = (_) => {
      this.updateGeoplacement()
    }

    // If the geodetic position of the origin is changed, update the position of the TileNode.
    this.geoManager.onOriginChanged.add(onOriginChangedEventListener)

    this.onDisposeObservable.add(() => {
      this.geoManager.onOriginChanged.remove(onOriginChangedEventListener)
    })
  }

  private updateGeoplacement(): void {
    if (this.originEcef) {
      const origin = this.geoManager.origin
      const pose = GeoCoordUtil.ecefToEnu(this.originEcef, origin)
      this.rotationQuaternion = pose.rotation
      this.position = pose.position
    }
  }
}
