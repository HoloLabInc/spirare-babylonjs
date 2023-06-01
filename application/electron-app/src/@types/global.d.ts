import {
  FileData,
  SceneIdentifier,
  SceneInfo,
} from 'spirare-babylonjs/src/types'

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export interface ElectronAPI {
  uploadFile: (
    sceneIdentifier: SceneIdentifier,
    target: FileData
  ) => Promise<{ base: string; relativePath: string } | undefined>
  downloadFile: (absFilepath: string) => Promise<ArrayBuffer | undefined>
  savePoml: (
    sceneIdentifier: SceneIdentifier,
    poml: string
  ) => Promise<string | undefined>
  deletePoml: (sceneIdentifier: SceneIdentifier) => Promise<void>

  openSceneFolder: (sceneIdentifier: SceneIdentifier) => Promise<void>

  loadPoml: (sceneIdentifier: SceneIdentifier) => Promise<string | undefined>
  getAbsoluteFilePath: (
    sceneIdentifier: SceneIdentifier,
    relativePath: string
  ) => Promise<string>

  getRecentScenes: () => Promise<SceneInfo[]>
}
