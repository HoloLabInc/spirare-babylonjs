import {
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  LinesMesh,
  AbstractMesh,
} from '@babylonjs/core'
import { PomlGeometry, PomlGeometryElement } from 'ts-poml'
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

  protected override get meshes(): (AbstractMesh | undefined)[] {
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

    this.updateDisplay()
    this.updateLayerMask()
  }

  private static createGeometry(
    app: App,
    scene: Scene,
    geometries: PomlGeometry[]
  ): LinesMesh[] {
    return geometries.map((g) => {
      switch (g.type) {
        case 'line': {
          const color = stringToColor(g.color ?? this.default.color)
          const points: Vector3[] = g.positions.map((p) => {
            switch (p.type) {
              case 'relative': {
                return new Vector3(p.x, p.y, p.z)
              }
              case 'geo-location': {
                const pos = app.geoManager.geodeticPositionToBabylonPosition(p)
                return pos
              }
            }
          })
          const colors = points.map((_) => color.clone())
          const options = {
            points: points,
            updatable: false,
            colors: colors,
          }
          return MeshBuilder.CreateLines('line', options, scene)
        }
        default: {
          let _: AssertTrue<IsNever<typeof g.type>>
          throw new Error('It must be unreachable')
        }
      }
    })
  }
}
