import 'cesium/Widgets/widgets.css'
import { createAppAsync } from 'spirare-babylonjs/src/app'
import {
  UploadFileResult,
  FileData,
  getAppLaunchParms,
} from 'spirare-babylonjs/src/types'

window.onbeforeunload = (e) => {
  // Tested only in Edge (Chromium) and Chrome.
  // If something other than null or undefined is returned, a dialog will appear asking if the page should be closed.
  // The content of the dialog is browser-dependent and cannot be changed.
  // The alert() function cannot be used within this event.
  // If you write this in an Electron app, no confirmation message will appear and the window will not be closed.
  return ''
}

const launchParams = getAppLaunchParms(window.location.search)
launchParams.startPageUrl = '/'
const params = {
  launchParams,
}

createAppAsync(params).then((app) => {
  app.uploadFile = async (target: FileData): Promise<UploadFileResult> => {
    const name = target.isLocalFile
      ? target.filepath.split('/').pop()
      : target.name

    const blob = new Blob([target.data])
    const blobUrl = URL.createObjectURL(blob)

    return {
      success: true,
      src: blobUrl,
      filename: name,
    }
  }
})
