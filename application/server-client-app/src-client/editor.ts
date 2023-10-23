import 'cesium/Widgets/widgets.css'
import { App } from 'spirare-babylonjs/src/app'
import { LoadPomlOptions } from 'spirare-babylonjs/src/pomlLoader'
import { FileData, getAppLaunchParms } from 'spirare-babylonjs/src/types'
import { UploadResponse } from '../src/types'
import { getPomlAsync } from './common/api'

let latestSavePomlPromise: Promise<void> | undefined

const startApp = async () => {
  const params = getAppLaunchParms(location.search)
  params.startPageUrl = '/'
  if (params.showGroundGrid === undefined) {
    params.showGroundGrid = true
  }
  const app = new App({ launchParams: params })

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
