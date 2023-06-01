import { contextBridge, ipcRenderer } from 'electron'
import { FileData, SceneIdentifier } from 'spirare-babylonjs/src/types'

contextBridge.exposeInMainWorld('electronAPI', {
  uploadFile: (sceneIdentifier: SceneIdentifier, target: FileData) =>
    ipcRenderer.invoke('upload-file', sceneIdentifier, target),

  downloadFile: (absFilepath: string) =>
    ipcRenderer.invoke('download-file', absFilepath),

  savePoml: (sceneIdentifier: SceneIdentifier, poml: string) =>
    ipcRenderer.invoke('save-poml', sceneIdentifier, poml),

  deletePoml: (sceneIdentifier: SceneIdentifier) =>
    ipcRenderer.invoke('delete-poml', sceneIdentifier),

  openSceneFolder: (sceneInfo: SceneIdentifier) =>
    ipcRenderer.invoke('open-scene-folder', sceneInfo),

  loadPoml: (sceneIdentifier: SceneIdentifier) =>
    ipcRenderer.invoke('load-poml', sceneIdentifier),

  getAbsoluteFilePath: (
    sceneIdentifier: SceneIdentifier,
    relativePath: string
  ) =>
    ipcRenderer.invoke('get-absolute-file-path', sceneIdentifier, relativePath),

  getRecentScenes: () => ipcRenderer.invoke('get-recent-scenes'),
})
