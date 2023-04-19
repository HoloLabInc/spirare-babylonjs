import { Matrix, Quaternion, Vector3, Vector4 } from '@babylonjs/core'

const Rad2Deg = 180 / Math.PI
const Deg2Rad = Math.PI / 180
const a = 6378137
const fInv = 298.257223563
const f = 1 / fInv
const e2 = f * (2 - f)
const b = a * (1 - f)
const ePrime2 = (a * a - b * b) / (b * b)

export class GeoCoordUtil {
  public static ecefToEnu(
    ecef: Vector3,
    origin: Vector3
  ): { position: Vector3; rotation: Quaternion } {
    const delta = {
      x: ecef.x - origin.x,
      y: ecef.y - origin.y,
      z: ecef.z - origin.z,
    }
    const matrix = GeoCoordUtil.ecefToEnuMatrix(origin.x, origin.y, origin.z)

    // The reason is not clear, but it is necessary to invert the sign of w.
    const r = Quaternion.FromRotationMatrix(matrix)
    r.w = -r.w

    const mat = new Matrix()
    Matrix.FromQuaternionToRef(r, mat)
    const { x, y, z } = Vector3.TransformCoordinates(new Vector3(delta.x, delta.y, delta.z), mat)
    const position = new Vector3(x, z, y)

    const rotation = Quaternion.RotationAxis(
      Vector3.Up(),
      180 * Deg2Rad
    ).multiply(new Quaternion(r.x, -r.z, r.y, r.w))

    return {
      position: position,
      rotation: rotation,
    }
  }

  private static ecefToEnuMatrix(x: number, y: number, z: number): Matrix {
    const p = Math.sqrt(x * x + y * y)
    const theta = Math.atan2(z * a, p * b)
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)
    const phi = Math.atan2(
      z + ePrime2 * b * Math.pow(sinTheta, 3),
      p - e2 * a * Math.pow(cosTheta, 3)
    )

    const lambda = Math.atan2(y, x)
    const m1 = GeoCoordUtil.rotZMatrix(90)
    const m2 = GeoCoordUtil.rotYMatrix(90 - phi * Rad2Deg)
    const m3 = GeoCoordUtil.rotZMatrix(lambda * Rad2Deg)
    return m1.multiply(m2.multiply(m3))
  }

  private static rotZMatrix(angle: number): Matrix {
    const mat = new Matrix()
    const rad = Deg2Rad * angle
    const cosRad = Math.cos(rad)
    const sinRad = Math.sin(rad)
    mat.setRow(0, new Vector4(cosRad, sinRad, 0, 0))
    mat.setRow(1, new Vector4(-sinRad, cosRad, 0, 0))
    mat.setRow(2, new Vector4(0, 0, 1, 0))
    mat.setRow(3, new Vector4(0, 0, 0, 1))
    return mat
  }

  private static rotYMatrix(angle: number): Matrix {
    const mat = new Matrix()
    const rad = Deg2Rad * angle
    const cosRad = Math.cos(rad)
    const sinRad = Math.sin(rad)
    mat.setRow(0, new Vector4(cosRad, 0, -sinRad, 0))
    mat.setRow(1, new Vector4(0, 1, 0, 0))
    mat.setRow(2, new Vector4(sinRad, 0, cosRad, 0))
    mat.setRow(3, new Vector4(0, 0, 0, 1))
    return mat
  }
}
