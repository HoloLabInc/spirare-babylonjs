import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
const fsPromises = fs.promises

import multer from 'multer'
import * as bodyParser from 'body-parser'

import { UploadResponse } from '../../src/types'
import { contentDataPath, getPomlDir, getPomlPath } from '../dataPath'
import { generateSignature, ObjectToSign } from '../temporaryAuth'
import {
  getScenesOrderByLastModifiedDate,
  saveFileWithUniqueName,
} from 'spirare-server/src/spirare-server'

const upload = multer({ dest: 'tmp/uploads' })

import AsyncLock from 'async-lock'
import { authMiddleware, getUserId } from '../auth'
const lock = new AsyncLock()

const router = express.Router()
router.use(authMiddleware)

/*
router.get('/', async (req, res) => {
  res.send('ok')
})
*/

// /api/scenes
router.get('/scenes', async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const scenesPath = path.join(contentDataPath, userId)
  const scenes = await getScenesOrderByLastModifiedDate(scenesPath)
  res.send(scenes)
})

// /api/poml/[pomlId]
// POST
router.post(
  '/poml/:pomlId',
  bodyParser.text({ type: '*/*' }),
  async (req, res) => {
    const userId = getUserId(req)
    if (userId === undefined) {
      res.sendStatus(401)
      return
    }

    const pomlId = req.params.pomlId
    const poml = req.body

    // Save the file.
    const pomlPath = getPomlPath(userId, pomlId)
    const pomlDir = getPomlDir(userId)

    lock.acquire(
      'write',
      async () => {
        await fsPromises.mkdir(pomlDir, { recursive: true })
        await fsPromises.writeFile(pomlPath, poml)
      },
      (error, result) => {
        if (error) {
          console.log(error)
          res.sendStatus(500)
          return
        }

        res.sendStatus(200)
      }
    )
  }
)

// DELETE
router.delete('/poml/:pomlId', async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const pomlId = req.params.pomlId
  const pomlPath = getPomlPath(userId, pomlId)
  const pomlDataDir = getFileUploadPath(pomlId, userId)

  // Delete the poml and data folder.
  lock.acquire(
    'write',
    async () => {
      await fsPromises.unlink(pomlPath)
      await fsPromises.rm(pomlDataDir, { recursive: true, force: true })
    },
    (error, result) => {
      if (error) {
        console.log(error)
        res.sendStatus(500)
        return
      }

      res.sendStatus(200)
    }
  )
})

// /api/poml/[pomlId]/file
router.post('/poml/:pomlId/file', upload.single('file'), async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const pomlId = req.params.pomlId

  try {
    const encodedFilename = req.file?.originalname
    const tmpPath = req.file?.path?.replace(/\\/g, '/')
    if (tmpPath && encodedFilename) {
      const filename = decodeURIComponent(encodedFilename)

      const modelUploadPath = getFileUploadPath(pomlId, userId)
      const savedFilename = await saveFileWithUniqueName(
        modelUploadPath,
        tmpPath,
        filename
      )
      if (savedFilename === undefined) {
        const response: UploadResponse = {
          success: false,
        }
        res.send(response)
        return
      }

      const relativePath = ['poml', userId, pomlId, savedFilename].join('/')
      const response: UploadResponse = {
        success: true,
        relativePath: relativePath,
      }
      res.send(response)
    } else {
      // Bad Request
      res.sendStatus(400)
    }
  } catch (ex) {
    console.log(ex)
    res.sendStatus(500)
  }
})

// /api/temporary-poml/[pomlId]
router.get('/temporary-poml/:pomlId', async (req, res) => {
  const userId = getUserId(req)
  if (userId === undefined) {
    res.sendStatus(401)
    return
  }

  const pomlId = req.params.pomlId

  const protocol = req.protocol
  const host = req.get('host')

  const url = new URL(
    `temporary-poml/${userId}/${pomlId}`,
    `${protocol}://${host}`
  )

  // Valid period of URLs that can be accessed without authentication
  const expireSeconds = 1 * 60 * 60
  const expiryDate = new Date(new Date().valueOf() + expireSeconds * 1000)

  const objectToSign: ObjectToSign = {
    userId: userId,
    pomlId: pomlId,
    signedExpiry: expiryDate,
  }
  const signature = generateSignature(objectToSign)

  url.searchParams.append('se', expiryDate.toISOString())
  url.searchParams.append('sig', signature)

  const json = {
    url: url.href,
  }
  res.send(json)
})

const getFileUploadPath = (pomlId: string, userId: string) => {
  return path.join(contentDataPath, userId, pomlId)
}

export { router as apiRouter }
