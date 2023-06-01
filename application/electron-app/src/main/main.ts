import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
} from 'electron'
import { FileData, SceneInfo } from 'spirare-babylonjs/src/types'
import {
  getScenesOrderByLastModifiedDate,
  saveFileWithUniqueName,
} from 'spirare-server/src/spirare-server'
import tempfile from 'tempfile'
import * as path from 'path'
import * as http from 'http'
import * as fs from 'fs'
const fsPromises = fs.promises

import AsyncLock from 'async-lock'
const lock = new AsyncLock()

let latestPomlId: string

// Web server for accessing from Spirare Browser
const server = http.createServer(async (request, response) => {
  let url = request.url

  if (!url) {
    response.writeHead(404)
    response.end()
    return
  }

  url = decodeURI(url)

  // http://localhost:8080/foo -> /foo
  console.log(`request url: ${url}`)

  if (url == '/') {
    response.writeHead(302, {
      Location: '/' + latestPomlId,
    })
    response.end()
    return
  }

  const pomlId = url.slice(1)
  const content = await readPomlFile(pomlId)
  if (content) {
    // For auto-reload
    response.writeHead(200, {
      Refresh: '3',
    })
    response.end(content)
    return
  }

  response.writeHead(404)
  response.end()
})

const readPomlFile = async (pomlId: string) => {
  const filepath = getPomlFilePath(pomlId)

  if (filepath === undefined) {
    console.log('file not found')
    return
  }

  try {
    // If the file exists, return its contents
    if (fs.existsSync(filepath)) {
      const isFile = fs.lstatSync(filepath).isFile()
      if (isFile) {
        const data = fs.readFileSync(filepath)
        return data
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const contentsDataPath = path.join(app.getPath('userData'), 'ContentsData')

const getPomlFileFolderPath = (pomlId: string): string | undefined => {
  const filepath = pomlFilepathMap.get(pomlId)
  if (filepath === undefined) {
    return undefined
  }
  return path.dirname(filepath)
  //return filepath
  //return contentsDataPath
}

const getPomlFilePath = (pomlId: string): string | undefined => {
  const filepath = pomlFilepathMap.get(pomlId)
  return filepath
  /*
  if (filepath === undefined) {
  }
  */

  /*
  const folderPath = getPomlFileFolderPath(pomlId)
  return path.join(folderPath, `${pomlId}.poml`)
  */
}

const getFileUploadPath = (pomlId: string): string | undefined => {
  const folderPath = getPomlFileFolderPath(pomlId)
  if (folderPath === undefined) {
    return undefined
  }

  if (folderPath === contentsDataPath) {
    return path.join(folderPath, pomlId)
  } else {
    return path.join(folderPath, 'assets')
  }
}

function handleGetAbsoluteFilePath(
  event: IpcMainInvokeEvent,
  pomlId: string,
  relativePath: string
) {
  const pomlFileFolderPath = getPomlFileFolderPath(pomlId)
  if (pomlFileFolderPath === undefined) {
    return ''
  }
  const absolutePath = path.join(pomlFileFolderPath, relativePath)
  return absolutePath
}

async function handleUploadFile(
  event: IpcMainInvokeEvent,
  pomlId: string,
  target: FileData
): Promise<{ base: string; relativePath: string } | undefined> {
  let filepath: string
  let name: string
  let finalize: (() => void) | undefined = undefined
  if (target.isLocalFile === false) {
    filepath = tempfile()
    await fsPromises.writeFile(filepath, new Uint8Array(target.data))
    name = target.name
    finalize = () => fsPromises.rm(filepath)
  } else {
    filepath = target.filepath
    name = path.basename(target.filepath)
  }

  const pomlFolderPath = getPomlFileFolderPath(pomlId)
  const modelUploadPath = getFileUploadPath(pomlId)
  if (pomlFolderPath === undefined || modelUploadPath === undefined) {
    return undefined
  }

  try {
    const savedFilename = await saveFileWithUniqueName(
      modelUploadPath,
      filepath,
      name
    )
    if (savedFilename) {
      const absoluteFilePath = path.join(modelUploadPath, savedFilename)
      const relativePath = path.relative(pomlFolderPath, absoluteFilePath)

      return {
        base: pomlFolderPath,
        relativePath: relativePath,
      }
    }
    return undefined
  } finally {
    finalize?.()
  }
}

async function handleDownloadFile(
  event: IpcMainInvokeEvent,
  absFilepath: string
): Promise<ArrayBuffer | undefined> {
  try {
    const buf = await fsPromises.readFile(absFilepath)
    return buf.buffer
  } catch (error) {
    return undefined
  }
}

const createNewPomlFile = async (
  pomlId: string,
  poml: string
): Promise<void> => {
  const pomlFolderPath = contentsDataPath
  const pomlFilePath = path.join(pomlFolderPath, `${pomlId}.poml`)

  lock.acquire(
    'write',
    async () => {
      await fsPromises.mkdir(pomlFolderPath, { recursive: true })
      await fsPromises.writeFile(pomlFilePath, poml)
      pomlFilepathMap.set(pomlId, pomlFilePath)
      latestPomlId = pomlId
    },
    (error, result) => {
      if (error) {
        console.log(error)
      }
    }
  )
}

const handleSavePoml = async (
  event: IpcMainInvokeEvent,
  pomlId: string,
  poml: string
) => {
  const pomlFilePath = getPomlFilePath(pomlId)

  if (pomlFilePath === undefined) {
    await createNewPomlFile(pomlId, poml)
    return
  }

  //const pomlFolderPath = getPomlFileFolderPath(pomlId)

  //const pomlUploadPath = contentsDataPath
  //const filepath = path.join(pomlUploadPath, `${pomlId}.poml`)
  lock.acquire(
    'write',
    async () => {
      // await fsPromises.mkdir(pomlUploadPath, { recursive: true })
      await fsPromises.writeFile(pomlFilePath, poml)
      latestPomlId = pomlId
    },
    (error, result) => {
      if (error) {
        console.log(error)
      }
    }
  )
}

const deleteFolderIfEmpty = async (folderPath: string) => {
  const files = await fsPromises.readdir(folderPath)
  if (files.length === 0) {
    await fsPromises.rmdir(folderPath)
  }
}

const handleDeletePoml = async (event: IpcMainInvokeEvent, pomlId: string) => {
  const pomlPath = getPomlFilePath(pomlId)
  if (pomlPath === undefined) {
    console.log('poml not found')
    return
  }

  const pomlFolderPath = getPomlFileFolderPath(pomlId)
  const pomlDataDir = getFileUploadPath(pomlId)

  lock.acquire(
    'write',
    async () => {
      await fsPromises.unlink(pomlPath)

      if (pomlDataDir !== undefined) {
        await fsPromises.rm(pomlDataDir, { recursive: true, force: true })
      }

      if (pomlFolderPath !== undefined) {
        await deleteFolderIfEmpty(pomlFolderPath)
      }
    },
    (error, result) => {
      if (error) {
        console.log(error)
      }
    }
  )
}

const handleOpenSceneFolder = async (
  event: IpcMainInvokeEvent,
  pomlId: string
) => {
  // open folder with electron
  const pomlFileFolderPath = getPomlFileFolderPath(pomlId)
  if (pomlFileFolderPath === undefined) {
    return
  }

  try {
    shell.openPath(pomlFileFolderPath)
  } catch (ex) {
    console.log(ex)
  }
}

const handleLoadPoml = async (event: IpcMainInvokeEvent, pomlId: string) => {
  console.log(`load poml ${pomlId}`)

  const pomlBuffer = await readPomlFile(pomlId)
  if (pomlBuffer === undefined) {
    return undefined
  }

  latestPomlId = pomlId
  const poml = pomlBuffer.toString('utf-8')
  console.log(poml)
  return poml
}

const pomlFilepathMap: Map<string, string> = new Map()

const handleGetRecentScenes = async (
  event: IpcMainInvokeEvent
): Promise<SceneInfo[]> => {
  const searchDepth = 2
  const scenes = await getScenesOrderByLastModifiedDate(
    contentsDataPath,
    searchDepth
  )

  scenes.forEach((scene) => {
    pomlFilepathMap.set(scene.scene.pomlId, scene.filepath)
  })
  //return scenes
  return scenes.map((scene) => scene.scene)
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1200,
  })
  mainWindow.setMenuBarVisibility(false)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  const url = `file://${path.join(__dirname, '../startpage.html')}`
  mainWindow.loadURL(url)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  server.listen(8080)

  ipcMain.handle('upload-file', handleUploadFile)
  ipcMain.handle('download-file', handleDownloadFile)
  ipcMain.handle('save-poml', handleSavePoml)
  ipcMain.handle('delete-poml', handleDeletePoml)
  ipcMain.handle('open-scene-folder', handleOpenSceneFolder)
  ipcMain.handle('load-poml', handleLoadPoml)
  ipcMain.handle('get-absolute-file-path', handleGetAbsoluteFilePath)
  ipcMain.handle('get-recent-scenes', handleGetRecentScenes)
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
