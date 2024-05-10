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

import { networkInterfaces } from 'os'

import AsyncLock from 'async-lock'
const lock = new AsyncLock()

const serverPort = 8080

let latestPomlId: string
const pomlFilepathMap: Map<string, string> = new Map()

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
    if (latestPomlId === undefined) {
      response.writeHead(503)
      response.end()
      return
    }

    const pomlFilePath = getPomlFilePath(latestPomlId)
    if (pomlFilePath === undefined) {
      response.writeHead(404)
      response.end()
      return
    }

    let relativePath = path.relative(contentsDataPath, pomlFilePath)
    relativePath = relativePath.replace(/\\/g, '/')
    response.writeHead(302, {
      Location: relativePath,
    })
    response.end()
    return
  }

  const filepath = path.join(contentsDataPath, url)
  const pomlBuffer = await readFileAsync(filepath)
  if (pomlBuffer) {
    // For auto-reload
    if (url.endsWith('.poml')) {
      response.writeHead(200, {
        Refresh: '3',
      })
    }
    response.end(pomlBuffer)
    return
  }

  response.writeHead(404)
  response.end()
})

const readFileAsync = async (filepath: string) => {
  if (filepath === undefined) {
    console.log('file not found')
    return
  }

  try {
    // If the file exists, return its contents
    const stats = await fsPromises.lstat(filepath)
    if (stats.isFile()) {
      const data = await fsPromises.readFile(filepath)
      return data
    }
  } catch (error) {
    console.log(error)
  }
}

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

const getPomlFilePath = (pomlId: string): string | undefined => {
  const filepath = pomlFilepathMap.get(pomlId)
  return filepath
}

const getPomlFileFolderPath = (pomlId: string): string | undefined => {
  const filepath = getPomlFilePath(pomlId)
  if (filepath === undefined) {
    return undefined
  }
  return path.dirname(filepath)
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
      let relativePath = path.relative(pomlFolderPath, absoluteFilePath)
      relativePath = relativePath.replace(/\\/g, '/')
      relativePath = './' + relativePath

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
  // If poml is empty, do not save.
  if (poml === '') {
    return
  }

  const pomlFolderPath = contentsDataPath
  const pomlFilePath = path.join(pomlFolderPath, `${pomlId}.poml`)

  lock.acquire(
    'write',
    async () => {
      await fsPromises.mkdir(pomlFolderPath, { recursive: true })
      await saveFileAsync(pomlFilePath, poml)
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
  // If poml is empty, do not save.
  if (poml === '') {
    return
  }

  const pomlFilePath = getPomlFilePath(pomlId)

  if (pomlFilePath === undefined) {
    await createNewPomlFile(pomlId, poml)
    return
  }

  lock.acquire(
    'write',
    async () => {
      await saveFileAsync(pomlFilePath, poml)
      latestPomlId = pomlId
    },
    (error, result) => {
      if (error) {
        console.log(error)
      }
    }
  )
}

/**
 * Write data to temporary file and copy to filePath.
 * @param filePath
 * @param data
 * @returns
 */
const saveFileAsync = async (
  filePath: string,
  data: string
): Promise<boolean> => {
  const tempFilePath = filePath + '.tmp'

  try {
    await fsPromises.writeFile(tempFilePath, data)
  } catch (e) {
    console.log(e)
    return false
  }

  try {
    await fsPromises.copyFile(tempFilePath, filePath)
  } catch (e) {
    console.log(e)
    return false
  }

  // Remove temporary file.
  try {
    await fsPromises.unlink(tempFilePath)
  } catch (e) {
    console.log(e)
  }

  return true
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
  return poml
}

const getScenesAndUpdateMap = async (): Promise<SceneInfo[]> => {
  const searchDepth = 100
  const scenes = await getScenesOrderByLastModifiedDate(
    contentsDataPath,
    searchDepth
  )

  scenes.forEach((scene) => {
    pomlFilepathMap.set(scene.scene.pomlId, scene.filepath)
  })
  return scenes.map((scene) => scene.scene)
}

const handleGetRecentScenes = async (
  event: IpcMainInvokeEvent
): Promise<SceneInfo[]> => {
  return await getScenesAndUpdateMap()
}

const handleGetServerUrl = async (
  event: IpcMainInvokeEvent
): Promise<{ name: string; url: string }[]> => {
  const servers: { name: string; url: string }[] = []

  const ignoreNames = [/^vEthernet/]

  const nets = networkInterfaces()
  Object.keys(nets).forEach((name) => {
    const net = nets[name]
    if (net === undefined) {
      return
    }

    if (ignoreNames.some((ignoreName) => ignoreName.test(name))) {
      return
    }

    net.forEach((netInfo) => {
      if (netInfo.internal) {
        return
      }
      if (netInfo.family !== 'IPv4') {
        return
      }
      const url = `http://${netInfo.address}:${serverPort}`
      servers.push({ name, url: url })
    })
  })

  return servers
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

  // Open filer when file download completed.
  mainWindow.webContents.session.on(
    'will-download',
    (event, item, webContents) => {
      item.once('done', (event, state) => {
        if (state === 'completed') {
          const filePath = item.getSavePath()
          shell.showItemInFolder(filePath)
        }
      })
    }
  )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await getScenesAndUpdateMap()

  server.listen(serverPort)

  ipcMain.handle('upload-file', handleUploadFile)
  ipcMain.handle('download-file', handleDownloadFile)
  ipcMain.handle('save-poml', handleSavePoml)
  ipcMain.handle('delete-poml', handleDeletePoml)
  ipcMain.handle('open-scene-folder', handleOpenSceneFolder)
  ipcMain.handle('load-poml', handleLoadPoml)
  ipcMain.handle('get-absolute-file-path', handleGetAbsoluteFilePath)
  ipcMain.handle('get-recent-scenes', handleGetRecentScenes)
  ipcMain.handle('get-server-url', handleGetServerUrl)

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
