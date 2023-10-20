import {
  Scene,
  Vector3,
  PointsCloudSystem,
  Color4,
  AbstractMesh,
} from '@babylonjs/core'
import { load } from '@loaders.gl/core'
import { Loader } from '@loaders.gl/loader-utils'
import { PLYLoader } from '@loaders.gl/ply'

type pointFunction = (
  particle: { position: Vector3; color: Color4 },
  index: number
) => void

export class PointCloudLoader {
  public static async importWithUrlAsync(
    url: string,
    fileExtension: string,
    scene: Scene
  ): Promise<{ meshes: AbstractMesh[] } | undefined> {
    let loader: Loader

    switch (fileExtension) {
      case 'ply':
        loader = PLYLoader
        break
      default:
        return undefined
    }

    const options = {}
    const data = await load(url, loader, options)

    const attributes = data.attributes
    const positions = attributes.POSITION as {
      value: Float32Array
      size: number
    }
    const colors = attributes.COLOR_0 as {
      value: Uint8Array
      size: number
    }

    const pointCount = positions.value.length / positions.size

    const pointCloudData: PointCloudData = {
      length: pointCount,
      positions: positions.value,
      colors: colors.value,
    }

    return this.importAsync(pointCloudData, scene)
  }

  public static async importAsync(
    data: PointCloudData,
    scene: Scene
  ): Promise<{ meshes: AbstractMesh[] } | undefined> {
    const pointCount = data.length
    const positions = data.positions
    const colors = data.colors

    // Load in batches of 1 million points to avoid Out of Memory errors.
    const meshes = []
    let pointOffset = 0
    while (pointOffset < pointCount) {
      const loadPointCount = Math.min(pointCount - pointOffset, 1000000)
      const pcs = await this.loadPointCloud(
        scene,
        loadPointCount,
        (particle, i) => {
          const index = i + pointOffset

          particle.position = getPointPosition(positions, index)
          if (colors) {
            particle.color = getPointColor(colors, index)
          }
        }
      )
      if (pcs.mesh !== undefined) {
        meshes.push(pcs.mesh)
      }
      pointOffset += loadPointCount
    }

    return { meshes }
  }

  private static async loadPointCloud(
    scene: Scene,
    num: number,
    pointFunction: pointFunction
  ) {
    const pointSize = 1
    const pcs = new PointsCloudSystem('pcs', pointSize, scene)

    const loadPoint = function (particle: any, i: number, s: number) {
      pointFunction(particle, i)
    }

    pcs.addPoints(num, loadPoint)
    await pcs.buildMeshAsync()
    return pcs
  }
}

export type PointCloudData = {
  length: number
  positions: Float32Array
  colors?: Uint8Array
}

const getPointPosition = (positions: Float32Array, index: number) => {
  // ply: Y-up right-handed
  // babylon: Y-up left-handed
  const x = -positions[index * 3]
  const y = positions[index * 3 + 1]
  const z = positions[index * 3 + 2]
  return new Vector3(x, y, z)
}

const getPointColor = (colors: Uint8Array, index: number) => {
  const r = colors[index * 3] / 255
  const g = colors[index * 3 + 1] / 255
  const b = colors[index * 3 + 2] / 255
  return new Color4(r, g, b)
}
