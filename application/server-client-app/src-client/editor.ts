import 'cesium/Widgets/widgets.css'
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

//import { StreetViewPanorama } from 'google.maps'

function initialize() {
  const fenway = { lat: 42.345573, lng: -71.098326 }
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
      position: fenway,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  )

  const panorama_background = new google.maps.StreetViewPanorama(
    document.getElementById('streetview_background') as HTMLElement,
    {
      position: fenway,
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
      panorama2.setPov(panorama1.getPov())
    })

    panorama1.addListener('position_changed', () => {
      panorama2.setPosition(panorama1.getPosition() as google.maps.LatLng)
    })
  }
}

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
  const app = await createAppAsync({ launchParams: params })

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

startApp()
