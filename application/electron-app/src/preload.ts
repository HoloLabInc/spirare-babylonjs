import { contextBridge, ipcRenderer } from 'electron'
import { FileData, SceneInfo } from 'spirare-babylonjs/src/types'

contextBridge.exposeInMainWorld('electronAPI', {
  uploadFile: (sceneInfo: SceneInfo, target: FileData) =>
    ipcRenderer.invoke('upload-file', sceneInfo, target),

  downloadFile: (absFilepath: string) =>
    ipcRenderer.invoke('download-file', absFilepath),

  savePoml: (sceneInfo: SceneInfo, poml: string) =>
    ipcRenderer.invoke('save-poml', sceneInfo, poml),

  deletePoml: (sceneInfo: SceneInfo) =>
    ipcRenderer.invoke('delete-poml', sceneInfo),

  openSceneFolder: (sceneInfo: SceneInfo) =>
    ipcRenderer.invoke('open-scene-folder', sceneInfo),

  loadPoml: (sceneInfo: SceneInfo) =>
    ipcRenderer.invoke('load-poml', sceneInfo),

  getAbsoluteFilePath: (sceneInfo: SceneInfo, relativePath: string) =>
    ipcRenderer.invoke('get-absolute-file-path', sceneInfo, relativePath),

  getRecentScenes: () => ipcRenderer.invoke('get-recent-scenes'),
})
