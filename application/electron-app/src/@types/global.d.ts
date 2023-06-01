import { FileData, SceneInfo } from 'spirare-babylonjs/src/types'

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export interface ElectronAPI {
  uploadFile: (
    sceneInfo: SceneInfo,
    target: FileData
  ) => Promise<{ base: string; relativePath: string } | undefined>
  downloadFile: (absFilepath: string) => Promise<ArrayBuffer | undefined>
  savePoml: (sceneInfo: SceneInfo, poml: string) => Promise<string | undefined>
  deletePoml: (sceneInfo: SceneInfo) => Promise<void>

  openSceneFolder: (sceneInfo: SceneInfo) => Promise<void>

  loadPoml: (sceneInfo: SceneInfo) => Promise<string | undefined>
  getAbsoluteFilePath: (
    sceneInfo: SceneInfo,
    relativePath: string
  ) => Promise<string>

  getRecentScenes: () => Promise<SceneInfo[]>
}
