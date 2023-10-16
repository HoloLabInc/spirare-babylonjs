import { App, CameraControllerFactory } from 'spirare-babylonjs/src/app'
import { DeviceOrientationCameraController } from 'spirare-babylonjs/src/artoolkitWebAR/deviceOrientationCameraController'
import { startCameraStream } from 'spirare-babylonjs/src/artoolkitWebAR/startCameraStream'
import { requestOrientationPermission } from 'spirare-babylonjs/src/artoolkitWebAR/deviceOrientationPermission'
import { ARToolkitManager } from 'spirare-babylonjs/src/artoolkitWebAR/artoolkitManager'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { getPomlAsync } from './common/api'
import {
  Color4,
  DeviceOrientationCamera,
  Quaternion,
  Vector3,
} from '@babylonjs/core'
//import { ArtoolkitCameraController } from './camera/artoolkitCameraController'
//import ARToolkitModule from '@ar-js-org/artoolkit5-js'
//import ARController from '@ar-js-org/artoolkit5-js/types/ARController'

const cameraControllerFactory: CameraControllerFactory = (
  app,
  scene,
  canvas
) => {
  scene.clearColor = new Color4(0, 0, 0, 0)
  const cameraController = new DeviceOrientationCameraController(scene, canvas)
  return cameraController
}

const startScene = async () => {
  const launchParams = getAppLaunchParms(window.location.search)
  launchParams.runMode = 'viewer'
  launchParams.displayMode = 'ar'
  launchParams.hideUI = true
  launchParams.hideInspector = true
  launchParams.hideOriginAxes = true
  launchParams.startPageUrl = '/'

  const app = new App({
    launchParams,
    cameraControllerFactory,
  })

  const pomlResult = await getPomlAsync(app.pomlId)

  if (pomlResult.type === 'Success') {
    const options: LoadPomlOptions = {
      createSceneRootNode: true,
    }
    await app.loadPomlAsync({ text: pomlResult.poml }, options)
  }

  return app
}

const artoolkitManager = new ARToolkitManager()

const startMarkerDetection = async (
  app: App,
  videoElement: HTMLVideoElement
) => {
  await artoolkitManager.initializeAsync(
    videoElement.videoWidth,
    videoElement.videoHeight,
    '/dist/artoolkit/camera_para.dat'
  )

  /*
  const arController = await ARToolkitModule.ARController.initWithDimensions(
    videoElement.videoWidth,
    videoElement.videoHeight,
    '/dist/artoolkit/camera_para.dat'
  )

  const markerInfoList = [
    { spaceId: 'markerAR', pattern: '/dist/artoolkit/pattern-AR.patt' },
  ] as MarkerInfo[]
  */
  const markerInfoList = [
    { spaceId: 'markerAR', pattern: '/dist/artoolkit/pattern-AR.patt' },
  ]

  await artoolkitManager.addMarkersAsync(markerInfoList)

  const FPS = 10

  // let detectionStartedTimeMap = new Map<number, number>()

  const intervalId = setInterval(() => {
    /*
    const detectedMarkers = detectMarker(
      arController,
      markerIdMap,
      detectionStartedTimeMap,
      videoElement
    )
    */
    const detectedMarkers = artoolkitManager.detectMarkers(videoElement)

    /*
    detectionStartedTimeMap = new Map(
      detectedMarkers.map((m) => [m.markerId, m.detectionStartedTime])
    )
    */

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

const startAR = async () => {
  startMenu.style.visibility = 'hidden'
  await requestOrientationPermission()

  arView.style.visibility = 'visible'
  const app = await startScene()

  await startCameraStream(videoElement, {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  })

  startMarkerDetection(app, videoElement)
}

const startMenu = document.getElementById('start-menu-container') as HTMLElement
const startButton = document.getElementById('start-button') as HTMLElement
const arView = document.getElementById('ar-view') as HTMLElement
const videoElement = document.getElementById('video') as HTMLVideoElement

startButton.addEventListener('click', startAR, false)
startMenu.style.visibility = 'visible'
