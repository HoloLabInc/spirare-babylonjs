import { Quaternion, Vector3 } from '@babylonjs/core'
import {
  Math,
  Cartesian3,
  Cartographic,
  Transforms,
  Matrix4,
  HeadingPitchRoll,
} from 'cesium'
import { CoordinateConverter } from '../coordinateConverter'

export type GeodeticPosition = {
  latitude: number
  longitude: number
  ellipsoidalHeight: number
}

export type EnuRotation = {
  x: number
  y: number
  z: number
  w: number
}

export type BeforeOriginChangedEventListener = (geoManager: GeoManager) => void
export type OnOriginChangedEventListener = (geoManager: GeoManager) => void

export class GeoManager {
  public origin: Vector3

  private get originCartesian3(): Cartesian3 {
    return new Cartesian3(this.origin.x, this.origin.y, this.origin.z)
  }

  private get enuMatrix(): Matrix4 {
    const mat = Transforms.eastNorthUpToFixedFrame(this.originCartesian3)
    return mat
  }

  constructor() {
    // this.origin = new Vector3(
    //   -3958511.2845905,
    //   3351066.14844459,
    //   3699868.87368868
    // )

    this.origin = new Vector3(
      -3957919.15158826,
      3351782.39993387,
      3699935.06079737
    )
  }

  private onChangedEventListeners = new Set<OnOriginChangedEventListener>()
  private beforeChangedEventListeners =
    new Set<BeforeOriginChangedEventListener>()

  public changeOrigin(origin: Vector3) {
    // Notify listeners before the update.
    this.beforeChangedEventListeners.forEach((listener) => listener(this))

    // Update the origin.
    this.origin = origin

    // Notify listeners after the update.
    this.onChangedEventListeners.forEach((listener) => listener(this))
  }

  public get onOriginChanged() {
    return {
      add: (
        onChangedListener?: OnOriginChangedEventListener,
        beforeChangedListener?: BeforeOriginChangedEventListener
      ) => {
        if (onChangedListener) {
          this.onChangedEventListeners.add(onChangedListener)
        }
        if (beforeChangedListener) {
          this.beforeChangedEventListeners.add(beforeChangedListener)
        }
      },
      remove: (
        onChangedListener?: OnOriginChangedEventListener,
        beforeChangedListener?: BeforeOriginChangedEventListener
      ) => {
        if (onChangedListener) {
          this.onChangedEventListeners.delete(onChangedListener)
        }
        if (beforeChangedListener) {
          this.beforeChangedEventListeners.delete(beforeChangedListener)
        }
      },
    }
  }

  /**
   * Convert position in Babylon.js coordinate system to ECEF coordinate system.
   */
  public babylonPositionToEcefPosition(point: Vector3): Vector3 {
    const cartesian = this.babylonPointToCesiumPoint(this.enuMatrix, point)
    return new Vector3(cartesian.x, cartesian.y, cartesian.z)
  }

  /**
   * Convert position in Babylon.js coordinate system to geodetic position.
   */
  public babylonPositionToGeodeticPosition(point: Vector3): GeodeticPosition {
    const cartesian = this.babylonPointToCesiumPoint(this.enuMatrix, point)
    const cartographic = Cartographic.fromCartesian(cartesian)

    return {
      latitude: Math.toDegrees(cartographic.latitude),
      longitude: Math.toDegrees(cartographic.longitude),
      ellipsoidalHeight: cartographic.height,
    }
  }

  /**
   * Convert rotation in Babylon.js coordinate system to ENU coordinate system.
   */
  public babylonRotationToSpirareEnuRotation(
    rotation: Quaternion,
    point: GeodeticPosition
  ): EnuRotation {
    const babylonToWorld = this.getEnuRotation(this.originCartesian3)

    const targetCartesian = Cartesian3.fromDegrees(
      point.longitude,
      point.latitude,
      point.ellipsoidalHeight
    )

    const targetToWorld = this.getEnuRotation(targetCartesian)

    const enuRotation = rotation
      .multiply(babylonToWorld)
      .multiply(Quaternion.Inverse(targetToWorld))

    return CoordinateConverter.toSpirareQuaternion(enuRotation)
  }

  /**
   * Convert geodetic position to position in Babylon.js coordinate system.
   */
  public geodeticPositionToBabylonPosition(
    geodeticPosition: GeodeticPosition
  ): Vector3 {
    const cartesian = Cartesian3.fromDegrees(
      geodeticPosition.longitude,
      geodeticPosition.latitude,
      geodeticPosition.ellipsoidalHeight
    )

    let ecefToEnuMatrix = new Matrix4()
    Matrix4.inverse(this.enuMatrix, ecefToEnuMatrix)

    let enuCartesian = new Cartesian3()
    Matrix4.multiplyByPoint(ecefToEnuMatrix, cartesian, enuCartesian)
    return new Vector3(enuCartesian.x, enuCartesian.z, enuCartesian.y)
  }

  /**
   * Convert rotation in ENU coordinate system to rotation in Babylon.js coordinate system.
   */
  public spirareEnuRotationToBabylonRotation(
    enuRotation: EnuRotation,
    point: GeodeticPosition
  ): Quaternion {
    const enuQuaternion = CoordinateConverter.toBabylonQuaternion(enuRotation)

    const babylonToWorld = this.getEnuRotation(this.originCartesian3)

    const targetCartesian = Cartesian3.fromDegrees(
      point.longitude,
      point.latitude,
      point.ellipsoidalHeight
    )

    const targetToWorld = this.getEnuRotation(targetCartesian)

    const rotation = enuQuaternion
      .multiply(targetToWorld)
      .multiply(Quaternion.Inverse(babylonToWorld))

    return rotation
  }

  private babylonPointToCesiumPoint(mat: Matrix4, point: Vector3) {
    return Matrix4.multiplyByPoint(
      mat,
      new Cartesian3(point.x, point.z, point.y),
      new Cartesian3()
    )
  }

  private getEnuRotation(origin: Cartesian3) {
    const hpr = new HeadingPitchRoll(0, 0, 0)
    const q = Transforms.headingPitchRollQuaternion(origin, hpr)

    // Convert Cesium Quaternion to Babylon.js Quaternion
    return new Quaternion(q.x, q.y, q.z, q.w)
  }
}
