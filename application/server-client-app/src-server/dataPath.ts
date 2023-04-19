import * as path from 'path'
import * as fs from 'fs'

export const dataRootDir =
  process.env.DATA_ROOT_DIR || path.join(__dirname, '..', 'tmp')
export const contentDataFolderName = 'ContentData'
export const contentDataPath = path.join(dataRootDir, contentDataFolderName)

fs.mkdirSync(contentDataPath, { recursive: true })

export const getPomlDir = (userId: string) => {
  return path.join(contentDataPath, userId)
}

export const getPomlPath = (userId: string, pomlId: string) => {
  return path.join(contentDataPath, userId, `${pomlId}.poml`)
}
