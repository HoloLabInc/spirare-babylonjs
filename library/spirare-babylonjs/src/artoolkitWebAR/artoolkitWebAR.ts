import { Quaternion, Vector3 } from '@babylonjs/core'
import { App } from '../app'
import { ARToolkitManager, MarkerInfo } from './artoolkitManager'

const getMarkerPose = (app: App) => {
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

  const markerRotation = Quaternion.RotationAxis(Vector3.Right(), -Math.PI / 2)
  const rotation = lookRotation.multiply(markerRotation)

  return { position, rotation }
}

export type MarkerAlignmentConfig = {
  cameraParamUrl: string
  markerInfoList: MarkerInfo[]
  stopDetectionOnMarkerFound: boolean
  requiredDetectionDurationMilliseconds: number
  detectionFps: number
}

export const startMarkerAlignmentAsync = async (
  app: App,
  videoElement: HTMLVideoElement,
  config: MarkerAlignmentConfig
) => {
  const artoolkitManager = new ARToolkitManager()

  await artoolkitManager.initializeAsync(
    videoElement.videoWidth,
    videoElement.videoHeight,
    config.cameraParamUrl
  )

  await artoolkitManager.addMarkersAsync(config.markerInfoList)

  const intervalId = setInterval(() => {
    const detectedMarkers = artoolkitManager.detectMarkers(videoElement)

    detectedMarkers.forEach((detectedMarker) => {
      const timeFromDetectionStarted =
        Date.now() - detectedMarker.detectionStartedTime

      if (
        timeFromDetectionStarted < config.requiredDetectionDurationMilliseconds
      ) {
        return
      }

      const { position, rotation } = getMarkerPose(app)

      app.updateSpaceStatus({
        type: 'updated',
        position: position,
        rotation: rotation,
        spaceType: 'Marker',
        spaceId: detectedMarker.markerInfo.spaceId,
      })

      if (config.stopDetectionOnMarkerFound) {
        clearInterval(intervalId)
      }
    })
  }, 1000 / config.detectionFps)
}
