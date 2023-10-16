/*
import { App, CameraControllerFactory } from 'spirare-babylonjs/src/app'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { getPomlAsync } from './common/api'
*/
/*
import {
  Color4,
  DeviceOrientationCamera,
  Quaternion,
  Vector3,
} from '@babylonjs/core'
*/
// import { ArtoolkitCameraController } from './camera/artoolkitCameraController'
import ARToolkitModule from '@ar-js-org/artoolkit5-js'
import ARController from '@ar-js-org/artoolkit5-js/types/ARController'

type MarkerInfo = {
  spaceId: string
  pattern: string
}
/*
const detectMarker = (
  arController: ARController,
  markerIdMap: Map<number, MarkerInfo>,
  detectionStartedTimeMap: Map<number, number>,
  videoElement: HTMLVideoElement
) => {
  const result = arController.detectMarker(videoElement)
  if (result !== 0) {
    // ARToolkit returning a value !== 0 means an error occured
    console.log('Error detecting markers')
    return []
  }

  const foundMarkerList: {
    index: number
    markerId: number
    markerInfo: MarkerInfo
    detectionStartedTime: number
  }[] = []

  for (let i = 0; i < arController.getMarkerNum(); i++) {
    const markerObj = arController.getMarker(i) as { idPatt: number }
    const markerId = markerObj.idPatt

    const markerInfo = markerIdMap.get(markerId)
    const detectionStartedTime =
      detectionStartedTimeMap.get(markerId) ?? Date.now()

    if (markerInfo !== undefined) {
      foundMarkerList.push({
        index: i,
        markerId: markerId,
        markerInfo: markerInfo,
        detectionStartedTime: detectionStartedTime,
      })
    }
  }
  return foundMarkerList
}
*/

/*
const initTargetMarkers = (
  arController: ARController,
  markerInfoList: MarkerInfo[]
) => {
  const markerIdMap = new Map<number, MarkerInfo>()

  const arId = (arController as any).id
  const artoolkit = arController.artoolkit

  markerInfoList.forEach(async (markerInfo) => {
    const markerId = await (artoolkit.addMarker(
      arId,
      markerInfo.pattern
    ) as unknown as Promise<number>)

    markerIdMap.set(markerId, markerInfo)
  })
  return markerIdMap
}
*/

type DetectedMarker = {
  index: number
  markerId: number
  markerInfo: MarkerInfo
  detectionStartedTime: number
}

export class ARToolkitManager {
  private arController: ARToolkitModule.ARController | undefined
  private markerIdMap = new Map<number, MarkerInfo>()
  private detectionStartedTimeMap = new Map<number, number>()

  public async initializeAsync(
    width: number,
    height: number,
    cameraParamUrl: string
  ) {
    this.arController = await ARToolkitModule.ARController.initWithDimensions(
      //videoElement.videoWidth,
      //videoElement.videoHeight,
      width,
      height,
      cameraParamUrl
      // '/dist/artoolkit/camera_para.dat'
    )
  }

  public async addMarkersAsync(markerInfoList: MarkerInfo[]) {
    if (this.arController === undefined) {
      return
    }

    const arId = (this.arController as any).id
    const artoolkit = this.arController.artoolkit

    markerInfoList.forEach(async (markerInfo) => {
      const markerId = await (artoolkit.addMarker(
        arId,
        markerInfo.pattern
      ) as unknown as Promise<number>)

      this.markerIdMap.set(markerId, markerInfo)
    })
  }

  public detectMarkers(
    // arController: ARController,
    // markerIdMap: Map<number, MarkerInfo>,
    // detectionStartedTimeMap: Map<number, number>,
    videoElement: HTMLVideoElement
  ) {
    if (this.arController === undefined) {
      return []
    }

    const result = this.arController.detectMarker(videoElement)
    if (result !== 0) {
      // ARToolkit returning a value !== 0 means an error occured
      console.log('Error detecting markers')
      return []
    }

    const detectedMarkers: DetectedMarker[] = []

    for (let i = 0; i < this.arController.getMarkerNum(); i++) {
      const markerObj = this.arController.getMarker(i) as { idPatt: number }
      const markerId = markerObj.idPatt

      const markerInfo = this.markerIdMap.get(markerId)
      const detectionStartedTime =
        this.detectionStartedTimeMap.get(markerId) ?? Date.now()

      if (markerInfo !== undefined) {
        detectedMarkers.push({
          index: i,
          markerId: markerId,
          markerInfo: markerInfo,
          detectionStartedTime: detectionStartedTime,
        })
      }
    }

    /*
    this.detectionStartedTimeMap.forEach((id, time) => {
      if (foundMarkerList.find((m) => m.markerId === id) === undefined) {
        this.detectionStartedTimeMap.delete(id)
      }
    })
	*/
    this.detectionStartedTimeMap = new Map(
      detectedMarkers.map((m) => [m.markerId, m.detectionStartedTime])
    )

    return detectedMarkers
  }
}

/*
const startMarkerDetection = async (
  app: App,
  videoElement: HTMLVideoElement
) => {
  await startCameraStream(videoElement)

  const arController = await ARToolkitModule.ARController.initWithDimensions(
    videoElement.videoWidth,
    videoElement.videoHeight,
    '/dist/artoolkit/camera_para.dat'
  )

  const markerInfoList = [
    { spaceId: 'markerAR', pattern: '/dist/artoolkit/pattern-AR.patt' },
  ] as MarkerInfo[]

  const markerIdMap = initTargetMarkers(arController, markerInfoList)

  const FPS = 10

  let detectionStartedTimeMap = new Map<number, number>()

  const intervalId = setInterval(() => {
    const detectedMarkers = detectMarker(
      arController,
      markerIdMap,
      detectionStartedTimeMap,
      videoElement
    )

    detectionStartedTimeMap = new Map(
      detectedMarkers.map((m) => [m.markerId, m.detectionStartedTime])
    )

    detectedMarkers.forEach((detectedMarker) => {
      const timeFromDetectionStarted =
        Date.now() - detectedMarker.detectionStartedTime

      if (timeFromDetectionStarted < 1 * 1000) {
        return
      }

      const cameraTarget = app.camera.target
      const horizontalForward = new Vector3(
        cameraTarget.x,
        0,
        cameraTarget.z
      ).normalize()
      const markerDistance = 1
      const position = horizontalForward.scaleInPlace(markerDistance)

      const lookRotation = Quaternion.FromLookDirectionLH(
        horizontalForward,
        Vector3.Up()
      )

      const markerRotation = Quaternion.RotationAxis(
        Vector3.Right(),
        -Math.PI / 2
      )
      const rotation = lookRotation.multiply(markerRotation)

      app.updateSpaceStatus({
        type: 'updated',
        position: position,
        rotation: rotation,
        spaceType: 'Marker',
        spaceId: detectedMarker.markerInfo.spaceId,
      })
      clearInterval(intervalId)
    })
  }, 1000 / FPS)
}

*/
