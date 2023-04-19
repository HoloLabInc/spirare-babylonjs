import { TargetCamera, Vector3 } from '@babylonjs/core'
import {
  Math as CesiumMath,
  Cartesian3,
  Transforms,
  Viewer,
  Matrix4,
  PerspectiveFrustum,
  Ion,
  CesiumTerrainProvider,
  IonResource,
  UrlTemplateImageryProvider,
  Cartographic,
  TerrainProvider,
  sampleTerrainMostDetailed,
  Credit,
} from 'cesium'
import { GeodeticPosition } from './cesium/geoManager'

const geodeticPositionToCartographic = (geodeticPosition: GeodeticPosition) => {
  const cartographic = Cartographic.fromDegrees(
    geodeticPosition.longitude,
    geodeticPosition.latitude,
    geodeticPosition.ellipsoidalHeight
  )
  return cartographic
}

const cartographicToGeodeticPosition = (cartographic: Cartographic) => {
  const geodeticPosition: GeodeticPosition = {
    longitude: cartographic.longitude * CesiumMath.DEGREES_PER_RADIAN,
    latitude: cartographic.latitude * CesiumMath.DEGREES_PER_RADIAN,
    ellipsoidalHeight: cartographic.height,
  }
  return geodeticPosition
}

export class CesiumManager {
  private viewer: Viewer
  private terrainProvider: TerrainProvider

  constructor() {
    Ion.defaultAccessToken = CESIUM_ION_TOKEN

    const { viewer, terrainProvider } = this.initViewer()
    this.viewer = viewer
    this.terrainProvider = terrainProvider
  }

  private initViewer() {
    // Terrain specification (EGM96, national terrain model generated from the 5m digital elevation data, areas without 5m data are supplemented with 10m data)
    const terrainProvider = new CesiumTerrainProvider({
      url: IonResource.fromAssetId(770371),
      credit: new Credit('地形データは、測量法に基づく国土地理院長承認（使用）R3JHs 778を得て使用'),
    })

    const viewer = new Viewer('cesiumContainer', {
      terrainProvider: terrainProvider,
      useDefaultRenderLoop: false,
      selectionIndicator: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      navigationInstructionsInitiallyVisible: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      contextOptions: {
        webgl: {
          alpha: false,
          antialias: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
          depth: true,
          stencil: false,
          anialias: false,
        },
      },
      targetFrameRate: 60,
      orderIndependentTranslucency: true,
      imageryProvider: undefined,
      baseLayerPicker: false,
      geocoder: false,
      automaticallyTrackDataSourceClocks: false,
      dataSources: undefined,
    })

    // Reference to orthophoto tiles created by Project PLATEAU, hosted by Geospatial Information Authority of Japan
    const imageProvider = new UrlTemplateImageryProvider({
      url: 'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
      maximumLevel: 19,
      credit: new Credit("Project PLATEAU https://www.mlit.go.jp/plateau/ (Licensed under CC BY 4.0 https://creativecommons.org/licenses/by/4.0/legalcode.ja)")
    })
    viewer.scene.imageryLayers.addImageryProvider(imageProvider)

    return { viewer, terrainProvider }
  }

  public render() {
    this.viewer.render()
  }

  public syncBabylonCameraToCesiumCamera(
    camera: TargetCamera,
    origin: Vector3
  ) {
    const fov = camera.fov
    const perspectiveFrustum = this.viewer.camera.frustum as PerspectiveFrustum
    if (perspectiveFrustum.aspectRatio < 1) {
      perspectiveFrustum.fov = fov
    } else {
      perspectiveFrustum.fov =
        2 * Math.atan(Math.tan(fov / 2) * perspectiveFrustum.aspectRatio)
    }

    const mat = Transforms.eastNorthUpToFixedFrame(
      new Cartesian3(origin.x, origin.y, origin.z)
    )

    this.viewer.camera.position = this.babylonPointToCesiumPoint(
      mat,
      camera.position
    )

    this.viewer.camera.direction = this.babylonVectorToCesiumVector(
      camera,
      mat,
      Vector3.Forward()
    )

    this.viewer.camera.up = this.babylonVectorToCesiumVector(
      camera,
      mat,
      Vector3.Up()
    )
  }

  public async sampleTerrainAsync(
    geodeticPositions: GeodeticPosition[]
  ): Promise<GeodeticPosition[]> {
    const cartographic = geodeticPositions.map(geodeticPositionToCartographic)
    const positions = await sampleTerrainMostDetailed(
      this.terrainProvider,
      cartographic
    )
    return positions.map(cartographicToGeodeticPosition)
  }

  public async getTerrainHeightAsync(geodeticPosition: GeodeticPosition) {
    const cartographic = geodeticPositionToCartographic(geodeticPosition)
    const positions = await sampleTerrainMostDetailed(this.terrainProvider, [
      cartographic,
    ])

    return positions[0].height
  }

  private babylonPointToCesiumPoint(mat: Matrix4, point: Vector3) {
    return Matrix4.multiplyByPoint(
      mat,
      new Cartesian3(point.x, point.z, point.y),
      new Cartesian3()
    )
  }

  private babylonVectorToCesiumVector(
    camera: TargetCamera,
    mat: Matrix4,
    vector: Vector3
  ) {
    const direction = camera.getDirection(vector)
    const cartesianDirection = new Cartesian3(
      direction.x,
      direction.z,
      direction.y
    )
    return Matrix4.multiplyByPointAsVector(
      mat,
      cartesianDirection,
      new Cartesian3()
    )
  }
}
