import express from 'express'
import { contentDataFolderName, getPomlPath } from '../dataPath'

import * as fs from 'fs'
const fsPromises = fs.promises

import { MaybePomlElement, PomlElement } from 'ts-poml'
import { PomlParser } from 'ts-poml/dist/pomlParser'
const pomlParser = new PomlParser()

import {
  FileSASPermissions,
  FileSASSignatureValues,
  generateFileSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-file-share'
import { ObjectToSign, verifySignature } from '../temporaryAuth'

const secret = 'secret_key'

const accountName = process.env.AZURE_FILES_ACCOUNT_NAME ?? ''
const accountKey = process.env.AZURE_FILES_ACCOUNT_KEY ?? ''
const shareName = process.env.AZURE_FILES_SHARE_NAME ?? ''

const router = express.Router()

// test page
router.get('/', async (req, res) => {
  res.sendStatus(200)
})

// /temporary-poml/[ownerId]/[pomlId]?se=2019-04-30T02%3A23%3A26Z&sig=Z%2FRHIX5Xcg0Mq2rqI3OlWTjEg2tYkboXr1P9ZUXDtkk%3D
router.get('/:ownerId/:pomlId', async (req, res) => {
  const params = req.params
  console.log(`Get temporary poml\npomlId: ${params.pomlId}\n`)

  const se = req.query.se
  const sig = req.query.sig
  if (typeof se !== 'string' || typeof sig !== 'string') {
    res.sendStatus(400)
    return
  }

  const signedExpiry = new Date(se)

  // Check access expiration
  const now = new Date()
  if (now > signedExpiry) {
    res.sendStatus(403)
    return
  }

  // Check signature
  const objectToSign: ObjectToSign = {
    userId: params.ownerId,
    pomlId: params.pomlId,
    signedExpiry: signedExpiry,
  }

  if (verifySignature(objectToSign, sig) == false) {
    res.sendStatus(400)
    return
  }

  const pomlPath = getPomlPath(params.ownerId, params.pomlId)

  try {
    const pomlStr = await fsPromises.readFile(pomlPath, {
      encoding: 'utf-8',
    })
    const poml = pomlParser.parse(pomlStr)
    replaceSrcUrlToTemporaryUrl(poml.scene.children, signedExpiry)

    const temporaryPoml = pomlParser.build(poml)
    res.send(temporaryPoml)
  } catch (ex) {
    console.log(ex)
    res.sendStatus(400)
  }
})

const replaceSrcUrlToTemporaryUrl = (
  elements: MaybePomlElement[],
  expiryDate: Date
) => {
  elements.forEach((element) => {
    if (element.type === '?') {
      return
    }

    replaceSrcUrlToTemporaryUrl(element.children, expiryDate)

    if ('src' in element) {
      const src = element.src

      if (src == undefined) {
        return
      }
      if (src.startsWith('http:') || src.startsWith('https:')) {
        return
      }

      element.src = getTemporaryPath(src, expiryDate)
    }
  })
}

/**
 * Get the file path for Azure Files
 * @param url
 * @returns
 */
const getAzureFilesPath = (url: string): string => {
  if (url.startsWith('poml/')) {
    return `${contentDataFolderName}/${url.substring(5)}`
  }

  return `${contentDataFolderName}/${url}`
}

const getTemporaryPath = (originalPath: string, expiryDate: Date) => {
  const filePath = getAzureFilesPath(originalPath)
  const permissions = FileSASPermissions.parse('r')

  const signatureValues: FileSASSignatureValues = {
    shareName: shareName,
    filePath: filePath,
    permissions: permissions,
    expiresOn: expiryDate,
  }

  const credential = new StorageSharedKeyCredential(accountName, accountKey)
  const sas = generateFileSASQueryParameters(signatureValues, credential)

  const fileUrl = `https://${accountName}.file.core.windows.net/${shareName}/${filePath}`
  return `${fileUrl}?${sas.toString()}`
}

export { router as temporaryPomlRouter }
