import {
  GizmoManager,
  Nullable,
  PointerEventTypes,
  Scene,
  TransformNode,
} from '@babylonjs/core'
import { SpirareNode } from './spirareNode/spirareNode'

export type GizmoCoordinate = 'world' | 'local'
export type GizmoMode = 'none' | 'position' | 'rotation' | 'scale'

export class GizmoController {
  private readonly gizmoManager: GizmoManager

  private gizmoCoordinate: GizmoCoordinate = 'world'
  private _gizmoMode: GizmoMode = 'position'

  public get gizmoMode(): GizmoMode {
    return this._gizmoMode
  }

  private validInput: boolean = false
  private gizmoIsHidden: boolean = false
  private _attachedNode: SpirareNode | undefined

  public get attachedNode(): SpirareNode | undefined {
    return this._attachedNode
  }

  private _isBeingDragged: boolean = false

  public get isBeingDragged(): boolean {
    return this._isBeingDragged
  }

  public onChange?: () => void

  constructor(scene: Scene) {
    this.gizmoManager = this.InitializeGizmo(scene)
    this.showGizmo()
  }

  public attach(node: SpirareNode) {
    const gm = this.gizmoManager
    gm.attachToNode(node)
    this._attachedNode = node
  }

  public detach() {
    const gm = this.gizmoManager
    gm.attachToNode(null)
    this._attachedNode = undefined
  }

  public setGizmoMode(mode: GizmoMode) {
    if (this._gizmoMode == mode) {
      return
    }

    this._gizmoMode = mode
    if (!this.gizmoIsHidden) {
      this.showGizmo()
    }
  }

  public switchGizmoCoordinate() {
    const coordinate = this.gizmoCoordinate == 'local' ? 'world' : 'local'
    this.setGizmoCoordinate(coordinate)
  }

  private InitializeGizmo(scene: Scene): GizmoManager {
    const manager = new GizmoManager(scene)
    manager.positionGizmoEnabled = true
    manager.rotationGizmoEnabled = true
    manager.scaleGizmoEnabled = true
    manager.attachableMeshes = null

    const gizmos = manager.gizmos

    if (gizmos.positionGizmo) {
      gizmos.positionGizmo.planarGizmoEnabled = true
    }

    const dragStartObservables = [
      gizmos.positionGizmo?.onDragStartObservable,
      gizmos.rotationGizmo?.onDragStartObservable,
      gizmos.scaleGizmo?.onDragStartObservable,
    ]

    dragStartObservables.forEach((observable) => {
      observable?.add(() => {
        this._isBeingDragged = true
      })
    })

    const dragEndObservables = [
      gizmos.positionGizmo?.onDragEndObservable,
      gizmos.rotationGizmo?.onDragEndObservable,
      gizmos.scaleGizmo?.onDragEndObservable,
    ]

    dragEndObservables.forEach((observable) => {
      observable?.add(() => {
        this._isBeingDragged = false
        this.onChange?.()
      })
    })

    // Disable operations by clicking the right and middle buttons
    manager.utilityLayer.utilityLayerScene.onPrePointerObservable.add(
      (eventData, _eventState) => {
        if (eventData.type == PointerEventTypes.POINTERDOWN) {
          if (eventData.event.button == 1 || eventData.event.button == 2) {
            if (eventData.ray) {
              eventData.ray.length = 0
            }
            this.validInput = false
          } else {
            this.validInput = true
          }
        } else {
          if (!this.validInput) {
            if (eventData.ray) {
              eventData.ray.length = 0
            }
          }
        }
      }
    )

    if (gizmos.scaleGizmo) {
      gizmos.scaleGizmo.sensitivity = 3
    }

    manager.positionGizmoEnabled = false
    manager.rotationGizmoEnabled = false
    manager.scaleGizmoEnabled = false

    return manager
  }

  private hideGizmo() {
    const gm = this.gizmoManager
    gm.positionGizmoEnabled = false
    gm.rotationGizmoEnabled = false
    gm.scaleGizmoEnabled = false
    gm.boundingBoxGizmoEnabled = false

    this.gizmoIsHidden = true
  }

  private showGizmo() {
    const gm = this.gizmoManager

    switch (this._gizmoMode) {
      case 'none':
        gm.positionGizmoEnabled = false
        gm.rotationGizmoEnabled = false
        gm.scaleGizmoEnabled = false
        gm.boundingBoxGizmoEnabled = false
        break
      case 'position':
        gm.positionGizmoEnabled = true
        gm.rotationGizmoEnabled = false
        gm.scaleGizmoEnabled = false
        gm.boundingBoxGizmoEnabled = false
        break
      case 'rotation':
        gm.positionGizmoEnabled = false
        gm.rotationGizmoEnabled = true
        gm.scaleGizmoEnabled = false
        gm.boundingBoxGizmoEnabled = false
        break
      case 'scale':
        gm.positionGizmoEnabled = false
        gm.rotationGizmoEnabled = false
        gm.scaleGizmoEnabled = true
        gm.boundingBoxGizmoEnabled = false
        break
    }

    this.gizmoIsHidden = false
  }

  /**
   * Set the coordinate system of the gizmos
   * @param coordinate - the coordinate system to set the gizmos to ('local' or 'world')
   */
  private setGizmoCoordinate(coordinate: GizmoCoordinate) {
    const gizmos = this.gizmoManager.gizmos

    // Scale gizmo cannot be set to world coordinate
    const coordinateSwitchableGizmos = []
    if (gizmos.positionGizmo) {
      coordinateSwitchableGizmos.push(gizmos.positionGizmo)
    }
    if (gizmos.rotationGizmo) {
      coordinateSwitchableGizmos.push(gizmos.rotationGizmo)
    }

    // Switch between displaying gizmos in world axis or object's local axis
    this.gizmoCoordinate = coordinate

    switch (coordinate) {
      case 'local':
        coordinateSwitchableGizmos.forEach((gizmo) => {
          gizmo.updateGizmoPositionToMatchAttachedMesh = true
          gizmo.updateGizmoRotationToMatchAttachedMesh = false
        })
        break
      case 'world':
        coordinateSwitchableGizmos.forEach((gizmo) => {
          gizmo.updateGizmoPositionToMatchAttachedMesh = true
          gizmo.updateGizmoRotationToMatchAttachedMesh = true
        })
        break
    }
  }
}
