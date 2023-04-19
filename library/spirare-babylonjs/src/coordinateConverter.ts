import { Vector3, Quaternion } from '@babylonjs/core'
import { Position, Rotation } from 'ts-poml'

export class CoordinateConverter {
  public static toBabylonScale(v: Position | number) {
    if (typeof v === 'number') {
      return new Vector3(v, v, v)
    } else {
      return new Vector3(v.y, v.z, v.x)
    }
  }

  public static toBabylonPosition(v: Position) {
    return new Vector3(-v.y, v.z, v.x)
  }

  public static toBabylonQuaternion(q: Rotation) {
    return new Quaternion(-q.y, q.z, q.x, -q.w)
  }

  public static toSpirareScale(v: Position) {
    return new Vector3(v.z, v.x, v.y)
  }

  public static toSpirarePosition(v: Position) {
    return new Vector3(v.z, -v.x, v.y)
  }

  public static toSpirareQuaternion(q: Rotation) {
    return new Quaternion(q.z, -q.x, q.y, -q.w)
  }
}
