import { SceneInfo } from 'spirare-babylonjs/src/types'

export type UploadResponse =
  | {
      success: false
    }
  | {
      success: true
      relativePath: string
    }

export type ScenesResponse = SceneInfo[]
