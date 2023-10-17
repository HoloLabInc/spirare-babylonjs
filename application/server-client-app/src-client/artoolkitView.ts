import { App } from 'spirare-babylonjs/src/app'
import { deviceOrientationCameraControllerFactory } from 'spirare-babylonjs/src/artoolkitWebAR/deviceOrientationCameraController'
import { startCameraStream } from 'spirare-babylonjs/src/artoolkitWebAR/startCameraStream'
import { requestOrientationPermission } from 'spirare-babylonjs/src/artoolkitWebAR/deviceOrientationPermission'
import {
  MarkerAlignmentConfig,
  startMarkerAlignmentAsync,
} from 'spirare-babylonjs/src/artoolkitWebAR/artoolkitWebAR'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { getPomlAsync } from './common/api'

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
    cameraControllerFactory: deviceOrientationCameraControllerFactory,
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

  const config: MarkerAlignmentConfig = {
    cameraParamUrl: '/dist/artoolkit/camera_para.dat',
    markerInfoList: [
      { spaceId: 'markerAR', pattern: '/dist/artoolkit/pattern-AR.patt' },
    ],
    stopDetectionOnMarkerFound: true,
    requiredDetectionDurationMilliseconds: 1000,
    detectionFps: 10,
  }
  startMarkerAlignmentAsync(app, videoElement, config)
}

const startMenu = document.getElementById('start-menu-container') as HTMLElement
const startButton = document.getElementById('start-button') as HTMLElement
const arView = document.getElementById('ar-view') as HTMLElement
const videoElement = document.getElementById('video') as HTMLVideoElement

startButton.addEventListener('click', startAR, false)
startMenu.style.visibility = 'visible'
