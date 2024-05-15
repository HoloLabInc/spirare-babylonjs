import 'cesium/Widgets/widgets.css'
import { Scene } from 'spirare-babylonjs/node_modules/@babylonjs/core'
import {
  App,
  CameraControllerFactory,
  createAppAsync,
} from 'spirare-babylonjs/src/app'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { FileData, getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { UploadResponse } from '../src/types'
import { getPomlAsync } from './common/api'
import { ICameraController } from 'spirare-babylonjs/src/camera/iCameraController'
import {
  CameraControllerOptions,
  FirstPersonCameraController,
} from 'spirare-babylonjs/src/camera/firstPersonCameraController'

import { Loader } from '@googlemaps/js-api-loader'

const streetViewMode = true

const firstPersonCameraControllerFactory: CameraControllerFactory = (
  app: App,
  scene: Scene,
  canvas: HTMLCanvasElement
): ICameraController => {
  const isGeodeticMode = app.isGeodeticMode

  const cameraOptions: CameraControllerOptions = {
    maxZ: isGeodeticMode ? 0 : 10000,
    upperRadiusLimit: isGeodeticMode ? 40000000 : 10000,
    lowerRadiusLimit: 0.01,
  }

  const cameraController = new FirstPersonCameraController(
    scene,
    canvas,
    app.isGeodeticMode ? app.geoManager : undefined,
    cameraOptions
  )

  return cameraController
}

function initialize() {
  const initialPosition = { lat: 35.562732879289804, lng: 139.71717142633142 }
  /*
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: fenway,
      zoom: 14,
    }
  );
  */
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetview_minimap') as HTMLElement,
    {
      position: initialPosition,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  )

  const panorama_background = new google.maps.StreetViewPanorama(
    document.getElementById('streetview_background') as HTMLElement,
    {
      position: initialPosition,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  )

  synchronizePanoramas(panorama, panorama_background)

  function synchronizePanoramas(
    panorama1: google.maps.StreetViewPanorama,
    panorama2: google.maps.StreetViewPanorama
  ) {
    panorama1.addListener('pov_changed', () => {
      console.log('pov_changed')
      panorama2.setPov(panorama1.getPov())
      if (firstPersonCameraController != undefined) {
        const pov = panorama1.getPov()
        const deg2rad = Math.PI / 180
        firstPersonCameraController.setGeodeticCameraPov(
          pov.heading * deg2rad,
          -pov.pitch * deg2rad
        )
      }
    })

    panorama1.addListener('position_changed', () => {
      panorama2.setPosition(panorama1.getPosition() as google.maps.LatLng)
      if (firstPersonCameraController != undefined) {
        const position = panorama1.getPosition()
        console.log(position)
        /*
        firstPersonCameraController.setGeodeticCameraTarget(
          position.lat(),
          position.lng()
        )
        */
      }
    })
  }
}

let firstPersonCameraController: FirstPersonCameraController | undefined

declare global {
  interface Window {
    initialize: () => void
  }
}
window.initialize = initialize

let latestSavePomlPromise: Promise<void> | undefined

const startApp = async () => {
  const params = getAppLaunchParms(location.search)
  params.startPageUrl = '/'

  const app = await createAppAsync({
    launchParams: params,
    cameraControllerFactory: streetViewMode
      ? firstPersonCameraControllerFactory
      : undefined,
  })

  if (streetViewMode) {
    firstPersonCameraController =
      app.cameraController as FirstPersonCameraController
    firstPersonCameraController?.setCameraHeight(2.5)
  }

  if (params.runMode === 'editor') {
    app.uploadFile = async (target: FileData) => {
      try {
        console.log('upload file')
        console.log(target)
        const formData = new FormData()

        let filename: string = ''
        if (target.isLocalFile == true) {
          filename = target.filepath.split('/').pop() ?? ''
        } else {
          filename = target.name
        }
        const encodedFilename = encodeURIComponent(filename)

        const blob = new Blob([target.data])
        formData.append('file', blob, encodedFilename)

        const result = await fetch(`/api/poml/${app.pomlId}/file`, {
          method: 'POST',
          body: formData,
        })

        if (result.ok == false) {
          return { success: false }
        }

        const response = (await result.json()) as UploadResponse
        console.log(response)

        if (response.success) {
          return {
            success: true,
            src: response.relativePath,
          }
        } else {
          return { success: false }
        }
      } catch (ex) {
        console.log(ex)
        return { success: false }
      }
    }

    const pomlResult = await getPomlAsync(app.pomlId)

    if (pomlResult.type === 'Error') {
      // If retrieving poml from server fails, return to the previous page.
      history.back()
      return
    }
    if (pomlResult.type === 'NotFound') {
      // For a newly created scene, the poml is empty, so save the initial state of the poml.
      const initialPoml = await app.buildPoml()
      await savePomlAsync(app.pomlId, initialPoml)
      await app.initializeScene(initialPoml)
    } else {
      // Load poml as the initial state if it exists.
      await app.initializeScene(pomlResult.poml)
    }

    // Receive the onChange event after the scene is initialized.
    app.onChange = async () => {
      const poml = await app.buildPoml()
      await savePomlAsync(app.pomlId, poml)
    }
  } else if (params.runMode === 'viewer') {
    if (app.pomlId) {
      const pomlResult = await getPomlAsync(app.pomlId)

      if (pomlResult.type === 'Error' || pomlResult.type === 'NotFound') {
        // If retrieving poml from server fails, return to the previous page.
        history.back()
        return
      }

      const options: LoadPomlOptions = {
        createSceneRootNode: true,
      }
      await app.loadPomlAsync({ text: pomlResult.poml }, options)
    }
  }

  if (streetViewMode) {
    await initGoogleMapsAsync()
  }
}

const savePomlAsync = async (pomlId: string, poml: string) => {
  latestSavePomlPromise = savePomlCoreAsync(pomlId, poml)
}

const savePomlCoreAsync = async (pomlId: string, poml: string) => {
  // Wait for the previous savePomlCoreAsync method to complete before calling the fetch function this time
  if (latestSavePomlPromise !== undefined) {
    await latestSavePomlPromise
  }

  try {
    const result = await fetch(`/api/poml/${pomlId}`, {
      method: 'POST',
      body: poml,
    })
    if (result.ok === false) {
      console.log(`Save poml failed: ${result.statusText}`)
    }
  } catch (ex) {
    console.log(ex)
  }
}

const initGoogleMapsAsync = async () => {
  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: 'weekly',
  })
  const streetView = await loader.importLibrary('streetView')

  const initialPosition = { lat: 35.562732879289804, lng: 139.71717142633142 }

  const panorama = new streetView.StreetViewPanorama(
    document.getElementById('streetview_minimap') as HTMLElement,
    {
      position: initialPosition,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  )
}

startApp()
