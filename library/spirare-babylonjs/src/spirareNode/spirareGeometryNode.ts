import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  AbstractMesh,
} from '@babylonjs/core'
import {
  PomlGeometry,
  PomlGeometryElement,
  parseGeometryPositionsString,
} from 'ts-poml'
import { App } from '../app'
import { stringToColor } from '../colorUtil'
import { AssertTrue, IsNever } from './spirareNodeUtils'
import { SpirareNodeBase } from './spirareNodeBase'
import { CreateNodeParams } from './spirareNode'

export class SpirareGeometryNode extends SpirareNodeBase<PomlGeometryElement> {
  private static default = {
    color: 'white',
  } as const

  private geometryMeshes: Mesh[] = []
  private disposes: { dispose: () => void }[] = []

  public override get meshes(): AbstractMesh[] {
    return this.geometryMeshes
  }

  private constructor(
    pomlElement: PomlGeometryElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(pomlElement, params, name)
    this.onDisposeObservable.add(() => {
      this.cleanUp()
    })
  }

  private cleanUp(): void {
    this.disposes.forEach((x) => x.dispose())
    this.disposes.length = 0
  }

  public static async create(
    pomlElement: PomlGeometryElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareGeometryNode> {
    const node = new SpirareGeometryNode(pomlElement, params, name)
    node.updateGeometry()
    return node
  }

  private updateGeometry(): void {
    this.cleanUp()

    const scene = this.getScene()
    this.geometryMeshes = SpirareGeometryNode.createGeometry(
      this.app,
      scene,
      this.element.geometries
    )
    this.geometryMeshes.forEach((m) => {
      m.parent = this
      this.disposes.push(m)
    })

    this.registerActionManager()
    this.updateNodeObjectStatus()
  }

  private static createGeometry(
    app: App,
    scene: Scene,
    geometries: PomlGeometry[]
  ): Mesh[] {
    return geometries.flatMap((g) => {
      switch (g.type) {
        case 'line': {
          let vertices = g.vertices

          if (typeof vertices === 'string') {
            vertices = parseGeometryPositionsString(vertices)
          }

          let points: Vector3[]
          switch (vertices?.type) {
            case 'relative': {
              points = vertices.positions.map((p) => {
                return new Vector3(p.x, p.y, p.z)
              })
              break
            }
            case 'geodetic': {
              points = vertices.positions.map((p) => {
                const pos = app.geoManager.geodeticPositionToBabylonPosition(p)
                return pos
              })
              break
            }
            default: {
              points = []
              break
            }
          }
          const color = stringToColor(g.color ?? this.default.color)
          const colors = points.map((_) => color.clone())
          const options = {
            points: points,
            updatable: false,
            colors: colors,
          }
          return [MeshBuilder.CreateLines('line', options, scene)]
        }
        case 'polygon': {
          console.warn('polygon is not implemented yet')
          return []
        }
        default: {
          let _: AssertTrue<IsNever<typeof g>>
          throw new Error('It must be unreachable')
        }
      }
    })
  }
}
