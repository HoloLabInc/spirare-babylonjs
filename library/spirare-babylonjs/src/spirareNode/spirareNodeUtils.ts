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
import { Display } from 'ts-poml'
import { SpirareModelNode } from './spirareModelNode'
import { SpirareVideoNode } from './spirareVideoNode'
import { SpirareImageNode } from './spirareImageNode'
import { SpirareCesium3dTilesNode } from './spirareCesium3dTilesNode'

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
 *
 * @param {number} aspect Aspect ratio = height / width
 * @param {Scene} scene Babylon scene
 * @param {string} materialName
 * @param {Texture} texture
 * @return {*}  {{
 *   plane: Mesh
 *   material: Material
 *   backPlane: Mesh
 *   backMaterial: Material
 * }}
 */
export const createPlaneAndBackPlane = (
  aspect: number,
  scene: Scene,
  texture: BaseTexture,
  namePrefix: string
): {
  plane: Mesh
  material: Material
  backPlane: Mesh
  backMaterial: Material
} => {
  const plane = MeshBuilder.CreatePlane(`${namePrefix}Plane`, {
    width: 1,
    height: aspect,
    // sideOrientation: Mesh.DOUBLESIDE,
  })
  plane.rotate(Vector3.Up(), Math.PI)
  const material = new StandardMaterial(`${namePrefix}Material`, scene)
  material.disableLighting = true
  material.emissiveTexture = texture
  material.opacityTexture = texture
  plane.material = material

  // Create a black back plane mesh
  const backMaterial = new StandardMaterial(
    `${namePrefix}BackPlaneMaterial`,
    scene
  )
  backMaterial.disableLighting = true
  const backPlane = MeshBuilder.CreatePlane(`${namePrefix}BackPlane`, {
    sideOrientation: Mesh.DOUBLESIDE, // Remove this line if you want single-sided rendering
    width: 1,
    height: aspect,
  })
  backPlane.rotate(Vector3.Up(), Math.PI)
  backPlane.material = backMaterial

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
