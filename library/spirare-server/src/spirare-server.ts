import * as path from 'path'
import * as fs from 'fs'
const fsPromises = fs.promises

import md5File from 'md5-file'

import { PomlParser } from 'ts-poml/dist/pomlParser'
import { Poml, PomlElement } from 'ts-poml'
import { PlacementMode, SceneInfo } from './types'
import { filenameGenerator } from './utils'

const getPlacementMode = (poml: Poml): PlacementMode => {
  const sceneElements = poml.scene.children
  if (sceneElements.length === 0) {
    // If sceneElements is empty,
    // space-reference tag is added to destinguish placement mode.
    const isSpaceMode = poml.scene.coordinateReferences.some(
      (x) => x.type === 'space-reference'
    )
    return isSpaceMode ? 'space' : 'geodetic'
  } else {
    const isGeodeticMode = sceneElements.some((x) =>
      x.coordinateReferences.some((cr) => cr.type === 'geo-reference')
    )
    return isGeodeticMode ? 'geodetic' : 'space'
  }
}

export const getScenesOrderByLastModifiedDate = async (
  scenesRootDir: string
): Promise<SceneInfo[]> => {
  try {
    const entries = await fsPromises.readdir(scenesRootDir, {
      withFileTypes: true,
    })

    const promises = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.poml'))
      .flatMap(async (file) => {
        const filepath = path.join(scenesRootDir, file.name)
        const pomlStr = await fsPromises.readFile(filepath, {
          encoding: 'utf-8',
        })

        const parser = new PomlParser()
        try {
          const poml = parser.parse(pomlStr)

          const title = poml.meta?.title
          const placementMode = getPlacementMode(poml)

          const scene: SceneInfo = {
            title: title,
            pomlId: path.basename(file.name, '.poml'),
            placementMode: placementMode,
          }
          const status = await fsPromises.stat(filepath)
          return {
            scene: scene,
            mtime: status.mtimeMs,
          }
        } catch (e) {
          console.log(e)
          return []
        }
      })

    const scenes = (await Promise.all(promises)).flat()

    // Items with a more recent last update time come first.
    const sortedScenes = scenes
      .sort((s1, s2) => s2.mtime - s1.mtime)
      .map((s) => s.scene)

    return sortedScenes
  } catch (ex) {
    console.log(ex)
    return []
  }
}

/**
 * Save the file with a unique file name.
 * @param uploadPath
 * @param filepath
 * @param name
 * @returns saved file name
 */
export const saveFileWithUniqueName = async (
  uploadPath: string,
  filepath: string,
  name: string
): Promise<string | undefined> => {
  console.log(filepath)

  await fsPromises.mkdir(uploadPath, { recursive: true })
  const generator = filenameGenerator(name)

  let fileHash: string | undefined = undefined

  for (;;) {
    const next = generator.next()
    if (next.done) {
      return undefined
    }

    const filename = next.value as string

    const dest = path.join(uploadPath, filename)

    try {
      await fsPromises.copyFile(filepath, dest, fs.constants.COPYFILE_EXCL)
      return filename
    } catch (error) {
      // If a file with that name already exists
      if (isCopyFileError(error) && error.code == 'EEXIST') {
        // Calculate the hash value of the file
        if (fileHash == undefined) {
          fileHash = await md5File(filepath)
        }
        const destHash = await md5File(dest)

        // If the hash values match, don't copy the file
        if (destHash == fileHash) {
          return filename
        }

        // If the hash values don't match, rename the file and try copying it again
        continue
      }

      console.log(error)
      return undefined
    }
  }
}

export function isCopyFileError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    typeof (error as { code: unknown }).code === 'string'
  )
}
