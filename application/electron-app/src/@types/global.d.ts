import { FileData, SceneInfo } from 'spirare-babylonjs/src/types'

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export interface ElectronAPI {
  uploadFile: (
    pomlId: string,
    target: FileData
  ) => Promise<{ base: string; relativePath: string } | undefined>
  downloadFile: (absFilepath: string) => Promise<ArrayBuffer | undefined>
  savePoml: (pomlId: string, poml: string) => Promise<string | undefined>
  deletePoml: (pomlId: string) => Promise<void>

  loadPoml: (pomlId: string) => Promise<string | undefined>
  getAbsoluteFilePath: (pomlId: string, relativePath: string) => Promise<string>

  getRecentScenes: () => Promise<SceneInfo[]>
}
