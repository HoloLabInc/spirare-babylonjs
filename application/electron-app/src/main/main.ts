import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
} from 'electron'
import {
  FileData,
  SceneIdentifier,
  SceneInfo,
} from 'spirare-babylonjs/src/types'
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

// let latestPomlId: string
let latestScene: SceneInfo

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
    // TODO
    /*
    response.writeHead(302, {
      Location: '/' + latestPomlId + '.poml',
    })
    */
    response.end()
    return
  }

  const content = await readContent(url)
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

const readContent = async (relativePath: string) => {
  const filepath = path.join(contentsDataPath, path.normalize(relativePath))
  console.log(filepath)

  try {
    // If the file exists, return its contents
    if (fs.existsSync(filepath)) {
      const isFile = fs.lstatSync(filepath).isFile()
      if (isFile) {
        console.log('file exists')
        const data = fs.readFileSync(filepath)
        return data
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const contentsDataPath = path.join(app.getPath('userData'), 'ContentsData')

/*
const getPomlFileFolderPath = (pomlId: string) => {
  return contentsDataPath
}
*/
const getPomlFileFolderPath = (sceneIdentifier: SceneIdentifier) => {
  // TODO
  //return contentsDataPath
  switch (sceneIdentifier.pomlPathMode) {
    case 'id':
      return contentsDataPath
    case 'path':
      return path.dirname(sceneIdentifier.pomlPath ?? '')
  }
}

// const getPomlFilePath = (pomlId: string) => {
const getPomlFilePath = (sceneIdentifier: SceneIdentifier) => {
  const folderPath = getPomlFileFolderPath(sceneIdentifier)
  // TODO
  return path.join(folderPath, `${sceneIdentifier.pomlId}.poml`)
}

//const getFileUploadPath = (pomlId: string) => {
const getFileUploadPath = (sceneIdentifier: SceneIdentifier) => {
  const folderPath = getPomlFileFolderPath(sceneIdentifier)
  return path.join(folderPath, 'assets')
}

function handleGetAbsoluteFilePath(
  event: IpcMainInvokeEvent,
  sceneIdentifier: SceneIdentifier,
  relativePath: string
) {
  const pomlFileFolderPath = getPomlFileFolderPath(sceneIdentifier)
  const absolutePath = path.join(pomlFileFolderPath, relativePath)
  return absolutePath
}

async function handleUploadFile(
  event: IpcMainInvokeEvent,
  sceneIdentifier: SceneIdentifier,
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

  try {
    const modelUploadPath = getFileUploadPath(sceneIdentifier)
    const savedFilename = await saveFileWithUniqueName(
      modelUploadPath,
      filepath,
      name
    )
    if (savedFilename) {
      //const relativePath = `./${pomlId}/${savedFilename}`
      // TODO
      const relativePath = `./${savedFilename}`
      return {
        base: contentsDataPath,
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

const handleSavePoml = async (
  event: IpcMainInvokeEvent,
  sceneIdentifier: SceneIdentifier,
  poml: string
) => {
  // Save files
  const pomlUploadPath = contentsDataPath

  console.log('save poml')
  console.log(sceneIdentifier)
  return
  /*
  const filepath = path.join(pomlUploadPath, `${pomlId}.poml`)
  lock.acquire(
    'write',
    async () => {
      await fsPromises.mkdir(pomlUploadPath, { recursive: true })
      await fsPromises.writeFile(filepath, poml)
      // latestPomlId = pomlId
      latestScene = sceneInfo
    },
    (error, result) => {
      if (error) {
        console.log(error)
      }
    }
  )
  */
}

const handleDeletePoml = async (
  event: IpcMainInvokeEvent,
  sceneIdentifier: SceneIdentifier
) => {
  const pomlPath = getPomlFilePath(sceneIdentifier)
  const pomlDataDir = getFileUploadPath(sceneIdentifier)

  lock.acquire(
    'write',
    async () => {
      await fsPromises.unlink(pomlPath)
      await fsPromises.rm(pomlDataDir, { recursive: true, force: true })
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
  sceneIdentifier: SceneIdentifier
) => {
  // open folder with electron
  const pomlFileFolderPath = getPomlFileFolderPath(sceneIdentifier)

  console.log(sceneIdentifier)
  console.log(pomlFileFolderPath)

  try {
    shell.openPath(pomlFileFolderPath)
  } catch (ex) {
    console.log(ex)
  }
}

const handleLoadPoml = async (
  event: IpcMainInvokeEvent,
  sceneIdentifier: SceneIdentifier
) => {
  console.log(`load scene ${sceneIdentifier}`)

  return

  /*
  const pomlBuffer = await readContent(`${pomlId}.poml`)
  if (pomlBuffer === undefined) {
    return undefined
  }

  // latestPomlId = pomlId
  latestScene = sceneInfo
  const poml = pomlBuffer.toString('utf-8')
  return poml
  */
}

const handleGetRecentScenes = async (
  event: IpcMainInvokeEvent
): Promise<SceneInfo[]> => {
  const folderDepth = 2
  const scenes = await getScenesOrderByLastModifiedDate(
    contentsDataPath,
    folderDepth
  )
  return scenes
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
