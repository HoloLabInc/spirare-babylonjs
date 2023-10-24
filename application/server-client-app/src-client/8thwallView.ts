declare var XR8: any
declare var XRExtras: any
declare var window: any

import * as BABYLON from 'spirare-babylonjs/node_modules/@babylonjs/core'
import {
  CameraControllerFactory,
  createAppAsync,
} from 'spirare-babylonjs/src/app'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { ArCameraController } from './camera/arCameraController'
import { getPomlAsync } from './common/api'

window.BABYLON = BABYLON

const searchParams = new URLSearchParams(window.location.search)
const enableVps = searchParams.get('vps') == 'enable'

const onxrloaded = () => {
  XR8.XrController.configure({ enableVps: enableVps })

  XR8.addCameraPipelineModules([
    // Add camera pipeline modules.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    vpsPipelineModule,
  ])

  startScene()
}

// Show loading screen before the full XR library has been loaded.
const load = () => {
  XRExtras.Loading.showLoading({ onxrloaded })
}

window.onload = () => {
  if (window.XRExtras) {
    load()
  } else {
    window.addEventListener('xrextrasloaded', load)
  }
}

// LightShip VPS
type WaySpotDetail = {
  name: string
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
    w: number
  }
}

let wayspotFoundOrUpdated: ((detail: WaySpotDetail) => void) | undefined
let wayspotLost: ((detail: WaySpotDetail) => void) | undefined

const wayspotScanningEvent = () => {}

const wayspotFoundEvent = (args: { detail: WaySpotDetail }) => {
  wayspotFoundOrUpdated?.(args.detail)
}

const wayspotUpdatedEvent = (args: { detail: WaySpotDetail }) => {
  wayspotFoundOrUpdated?.(args.detail)
}

const wayspotLostEvent = (args: { detail: WaySpotDetail }) => {
  wayspotLost?.(args.detail)
}

const vpsPipelineModule = {
  name: 'vps-pipeline',
  listeners: [
    {
      event: 'reality.projectwayspotscanning',
      process: wayspotScanningEvent,
    },
    {
      event: 'reality.projectwayspotfound',
      process: wayspotFoundEvent,
    },
    {
      event: 'reality.projectwayspotupdated',
      process: wayspotUpdatedEvent,
    },
    {
      event: 'reality.projectwayspotlost',
      process: wayspotLostEvent,
    },
  ],
}

const cameraControllerFactory: CameraControllerFactory = (
  app,
  scene,
  canvas
) => {
  const cameraController = new ArCameraController(scene)
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

  const app = await createAppAsync({
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

  wayspotFoundOrUpdated = (detail) => {
    app.updateSpaceStatus({
      type: 'updated',
      position: detail.position,
      rotation: detail.rotation,
      spaceType: 'Lightship',
      spaceId: detail.name,
    })
  }

  wayspotLost = (detail) => {
    app.updateSpaceStatus({
      type: 'lost',
      spaceType: 'Lightship',
      spaceId: detail.name,
    })
  }
}
