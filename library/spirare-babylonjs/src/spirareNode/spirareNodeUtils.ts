import {
  AbstractMesh,
  BaseTexture,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'
import { BackfaceMode, Display } from 'ts-poml'
import { SpirareModelNode } from './spirareModelNode'
import { SpirareVideoNode } from './spirareVideoNode'
import { SpirareImageNode } from './spirareImageNode'
import { SpirareCesium3dTilesNode } from './spirareCesium3dTilesNode'
import { stringToColor3 } from '../colorUtil'

export type IsNever<T> = [T] extends [never] ? true : false
export type AssertTrue<T extends true> = never

export const getHigherPriorityDisplay = (
  display1: Display,
  display2: Display
): Display => {
  const priorityOrder: Display[] = ['none', 'occlusion', 'visible']

  for (const display of priorityOrder) {
    if (display1 === display || display2 === display) {
      return display
    }
  }
  return display1
}

/**
 * Creates plane meshes for front and back faces
 */
export const createPlaneAndBackPlane = (
  size: { width: number; height: number },
  scene: Scene,
  textureOption: { texture: BaseTexture; transparent: boolean },
  namePrefix: string,
  backfaceOption?: { mode: BackfaceMode; color: string }
): {
  plane: Mesh
  material: Material
  backPlane?: Mesh
  backMaterial?: Material
} => {
  // Create a front plane
  const plane = MeshBuilder.CreatePlane(`${namePrefix}Plane`, {
    width: size.width,
    height: size.height,
  })
  plane.rotate(Vector3.Up(), Math.PI)

  const material = new StandardMaterial(`${namePrefix}Material`, scene)
  material.disableLighting = true
  material.emissiveTexture = textureOption.texture
  if (textureOption.transparent) {
    material.opacityTexture = textureOption.texture
  }
  plane.material = material

  const backfaceMode = backfaceOption?.mode ?? 'none'
  if (backfaceOption === undefined || backfaceMode === 'none') {
    return {
      plane: plane,
      material: material,
    }
  }

  // Create a back plane
  const backPlane = MeshBuilder.CreatePlane(`${namePrefix}BackPlane`, {
    width: size.width,
    height: size.height,
  })

  let backMaterial: StandardMaterial | undefined
  switch (backfaceMode) {
    case 'solid': {
      backMaterial = new StandardMaterial(
        `${namePrefix}BackPlaneMaterial`,
        scene
      )
      backMaterial.disableLighting = true
      backMaterial.emissiveColor = stringToColor3(backfaceOption.color)
      backPlane.material = backMaterial
      break
    }
    case 'visible': {
      backPlane.material = material
      break
    }
    case 'flipped': {
      backPlane.material = material
      backPlane.scaling = new Vector3(-1, 1, 1)
      break
    }
  }

  return {
    plane: plane,
    material: material,
    backPlane: backPlane,
    backMaterial: backMaterial,
  }
}

export const showMeshes = (
  meshes: (Mesh | AbstractMesh | undefined)[]
): void => {
  meshes.forEach((mesh) => mesh?.setEnabled(true))
}

export const hideMeshes = (
  meshes: (Mesh | AbstractMesh | undefined)[]
): void => {
  meshes.forEach((mesh) => mesh?.setEnabled(false))
}

export const getFileLoadUrlAsync = async (
  node:
    | SpirareModelNode
    | SpirareImageNode
    | SpirareVideoNode
    | SpirareCesium3dTilesNode
): Promise<string | undefined> => {
  const src = node.element.src
  if (src === undefined) {
    return undefined
  }

  let url = src
  if (node.app.sourceResolver) {
    const resolved = await node.app.sourceResolver.resolve(src)
    if (resolved.success) {
      url = resolved.src
    }
  }
  return url
}

export const getMediaDisplaySize = (
  element: { width?: number; height?: number },
  media: { width: number; height: number }
): { width: number; height: number } => {
  if (element.width !== undefined && element.height !== undefined) {
    return { width: element.width, height: element.height }
  }

  const aspectRatio = media.height / media.width

  if (element.width === undefined && element.height !== undefined) {
    return {
      width: element.height / aspectRatio,
      height: element.height,
    }
  }

  if (element.width !== undefined && element.height === undefined) {
    return {
      width: element.width,
      height: element.width * aspectRatio,
    }
  }

  return {
    width: 1,
    height: aspectRatio,
  }
}

export const parseAsNumber = (text: string | undefined): number | undefined => {
  if (!text) {
    return undefined
  }

  const num = Number(text)
  if (Number.isNaN(num)) {
    return undefined
  } else {
    return num
  }
}
