import 'cesium/Widgets/widgets.css'
import { createAppAsync } from 'spirare-babylonjs/src/app'
import {
  FileData,
  getAppLaunchParms,
  ResolvedSource,
} from 'spirare-babylonjs/src/types'

const startApp = async () => {
  const launchParams = getAppLaunchParms(location.search)
  launchParams.startPageUrl = 'startpage.html'
  const params = {
    launchParams,
  }
  const app = await createAppAsync(params)
  app.sourceResolver = new ElectronAppSourceResolver(app.pomlId)

  app.uploadFile = async (target: FileData) => {
    try {
      const uploaded = await window.electronAPI.uploadFile(app.pomlId, target)

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

  let poml = await window.electronAPI.loadPoml(app.pomlId)
  if (poml === undefined) {
    // There is no poml yet if a new scene is created
    poml = await app.buildPoml()
    await window.electronAPI.savePoml(app.pomlId, poml)
  }
  await app.initializeScene(poml)

  // Receive the onChange event after scene initialization is complete
  app.onChange = async () => {
    const poml = await app.buildPoml()
    await window.electronAPI.savePoml(app.pomlId, poml)
  }
}

class ElectronAppSourceResolver {
  private pomlId: string

  constructor(pomlId: string) {
    this.pomlId = pomlId
  }

  public async resolve(src: string): Promise<ResolvedSource> {
    // Return the path as is if it is an absolute path or an HTTP URL
    if (src.startsWith('/') || src.includes(':')) {
      return { success: true, src: src }
    }

    try {
      const absolutePath = await window.electronAPI.getAbsoluteFilePath(
        this.pomlId,
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
