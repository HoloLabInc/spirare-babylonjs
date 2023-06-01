import 'cesium/Widgets/widgets.css'
import { App } from 'spirare-babylonjs/src/app'
import {
  FileData,
  getAppLaunchParms,
  ResolvedSource,
  SceneIdentifier,
} from 'spirare-babylonjs/src/types'

const startApp = async () => {
  const launchParams = getAppLaunchParms(location.search)
  launchParams.startPageUrl = 'startpage.html'
  const params = {
    launchParams,
  }
  const app = new App(params)

  const sceneIdentifier = app.sceneIdentifier
  if (sceneIdentifier === undefined) {
    return
  }

  app.sourceResolver = new ElectronAppSourceResolver(sceneIdentifier)
  app.uploadFile = async (target: FileData) => {
    try {
      const uploaded = await window.electronAPI.uploadFile(
        sceneIdentifier,
        target
      )

      if (uploaded) {
        return {
          success: true,
          src: uploaded.relativePath,
        }
      }
    } catch (err) {
      console.log(err)
    }
    return { success: false }
  }

  let poml = await window.electronAPI.loadPoml(sceneIdentifier)
  if (poml === undefined) {
    // There is no poml yet if a new scene is created
    poml = await app.buildPoml()
    await window.electronAPI.savePoml(sceneIdentifier, poml)
  }
  await app.initializeScene(poml)

  // Receive the onChange event after scene initialization is complete
  app.onChange = async () => {
    const poml = await app.buildPoml()
    await window.electronAPI.savePoml(sceneIdentifier, poml)
  }
}

class ElectronAppSourceResolver {
  private sceneIdentifier: SceneIdentifier

  constructor(sceneIdentifier: SceneIdentifier) {
    this.sceneIdentifier = sceneIdentifier
  }

  public async resolve(src: string): Promise<ResolvedSource> {
    // Return the path as is if it is an absolute path or an HTTP URL
    if (src.startsWith('/') || src.includes(':')) {
      return { success: true, src: src }
    }

    try {
      const absolutePath = await window.electronAPI.getAbsoluteFilePath(
        this.sceneIdentifier,
        src
      )
      return {
        success: true,
        src: absolutePath,
      }
    } catch (err) {
      console.log(err)
      return { success: false }
    }
  }
}

startApp()
