import { contextBridge, ipcRenderer } from 'electron'
import { FileData } from 'spirare-babylonjs/src/types'

contextBridge.exposeInMainWorld('electronAPI', {
  uploadFile: (pomlId: string, target: FileData) =>
    ipcRenderer.invoke('upload-file', pomlId, target),

  downloadFile: (absFilepath: string) =>
    ipcRenderer.invoke('download-file', absFilepath),

  savePoml: (pomlId: string, poml: string) =>
    ipcRenderer.invoke('save-poml', pomlId, poml),

  deletePoml: (pomlId: string) => ipcRenderer.invoke('delete-poml', pomlId),

  openSceneFolder: (pomlId: string) => ipcRenderer.invoke('open-scene-folder', pomlId),

  loadPoml: (pomlId: string) => ipcRenderer.invoke('load-poml', pomlId),

  getAbsoluteFilePath: (pomlId: string, relativePath: string) =>
    ipcRenderer.invoke('get-absolute-file-path', pomlId, relativePath),

  getRecentScenes: () => ipcRenderer.invoke('get-recent-scenes'),
})
