import {
  InspectableType,
  Quaternion,
  TransformNode,
  Vector3,
  Space,
  ExecuteCodeAction,
  ActionManager,
  PredicateCondition,
  Observable,
  AbstractMesh,
  Matrix,
} from '@babylonjs/core'
import { Display, GeoReference, PomlElement, Position, Rotation } from 'ts-poml'
import { App, getApp } from '../app'
import { CoordinateConverter } from '../coordinateConverter'
import {
  BeforeOriginChangedEventListener,
  OnOriginChangedEventListener,
} from '../cesium/geoManager'
import { GizmoController } from '../gizmoController'
import { ScriptElementComponent } from '../wasm/scriptElementComponent'
import {
  getHigherPriorityDisplay,
  hideMeshes,
  showMeshes,
} from './spirareNodeUtils'
import { CreateNodeParams, SpirareNode } from './spirareNode'
import {
  CameraSpaceType,
  InvokableSpirareEventType,
  SpaceStatus,
  SpirareEventType,
} from '../types'

type IsNever<T> = [T] extends [never] ? true : false
type AssertTrue<T extends true> = never

type Pose = {
  position: Position
  rotation: Rotation
}

type CustomProperty = {
  spaceOrigin?: {
    enabled?: boolean
    spaceId?: string
    spaceType?: string
  }
  visibleInEditor?: boolean
  clickableInEditor?: boolean
}

const parseQuaternion = (str: string | undefined): Rotation | undefined => {
  if (str === undefined) {
    return undefined
  }

  const tokens = str.split(/,|\s+/).filter((x) => x !== '')
  if (tokens.length !== 4) {
    return undefined
  }

  const x = Number.parseFloat(tokens[0])
  const y = Number.parseFloat(tokens[1])
  const z = Number.parseFloat(tokens[2])
  const w = Number.parseFloat(tokens[3])

  if (
    Number.isNaN(x) ||
    Number.isNaN(y) ||
    Number.isNaN(z) ||
    Number.isNaN(w)
  ) {
    return undefined
  }

  const rotation = new Quaternion(x, y, z, w).normalize()
  return { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
}

const customAttributeKey = 'spirare-editor'

export class SpirareNodeBase<T extends PomlElement> extends TransformNode {
  private readonly _pomlElement: T
  private readonly _parentSpirareNode: SpirareNode | undefined
  private readonly gizmoController: GizmoController

  private scriptComponentsActivated: boolean = false
  private scriptComponents: ScriptElementComponent[]

  private readonly eventObservableMap = new Map<
    SpirareEventType,
    Observable<void>
  >()

  protected actionManager: ActionManager

  public readonly app: App
  public geoPlacement: boolean = false
  public customProperty: CustomProperty = {}

  public onChange?: () => void

  /**
   * Called when the object is selected by the mouse or other input device.
   */
  public onClick?: (node: SpirareNode) => void

  private get asSpirareNode(): SpirareNode<T['type']> {
    return this as unknown as SpirareNode<T['type']>
  }

  public get element(): T {
    return this._pomlElement
  }

  public get type(): T['type'] {
    return this.element.type
  }

  public get elementId(): T['id'] {
    return this._pomlElement.id
  }

  /**
   * Returns a list of the id of _pomlElement itself and the ids of coordinateReferences.
   */
  public get includedId(): string[] {
    const idCandidates = [
      this._pomlElement.id,
      ...(this._pomlElement.coordinateReferences?.map((x) => x.id) ?? []),
    ]

    return idCandidates.filter(
      (item): item is string => typeof item == 'string'
    )
  }

  public get displaySelf(): Display {
    return this._pomlElement.display ?? 'visible'
  }

  public get displayInHierarchy(): Display {
    if (this._parentSpirareNode === undefined) {
      return this.displaySelf
    }

    return getHigherPriorityDisplay(
      this.displaySelf,
      this._parentSpirareNode.displayInHierarchy
    )
  }

  public get arDisplaySelf(): Display {
    const arDisplay = this._pomlElement.arDisplay
    if (arDisplay === 'same-as-display') {
      return this.displaySelf
    }

    return arDisplay ?? 'visible'
  }

  public get arDisplayInHierarchy(): Display {
    if (this._parentSpirareNode === undefined) {
      return this.arDisplaySelf
    }

    return getHigherPriorityDisplay(
      this.arDisplaySelf,
      this._parentSpirareNode.arDisplayInHierarchy
    )
  }

  public get isArDisplayNone(): boolean {
    return this._pomlElement.arDisplay === 'none'
  }

  protected get isEditorMode(): boolean {
    return this.app.runMode === 'editor'
  }

  protected get isViewerMode(): boolean {
    return this.app.runMode === 'viewer'
  }

  protected get cameraSpaceTypeSelf(): CameraSpaceType {
    return 'world-space'
  }

  public get cameraSpaceTypeInHierarchy(): CameraSpaceType {
    if (this._parentSpirareNode === undefined) {
      return this.cameraSpaceTypeSelf
    }

    if (
      this.cameraSpaceTypeSelf === 'screen-space' ||
      this._parentSpirareNode.cameraSpaceTypeInHierarchy === 'screen-space'
    ) {
      return 'screen-space'
    }

    return 'world-space'
  }

  public get meshes(): AbstractMesh[] {
    return []
  }

  public get highlightable(): boolean {
    return true
  }

  protected get layerMask(): number {
    switch (this.cameraSpaceTypeInHierarchy) {
      case 'world-space':
        return 0x0fffffff
      case 'screen-space':
        return 0x10000000
    }
  }

  // called from the inspector.
  private get visibleInEditorInspector(): boolean {
    return this.customProperty.visibleInEditor ?? true
  }

  // called from the inspector.
  private set visibleInEditorInspector(value: boolean) {
    this.updateCustomProperty(() => {
      if (value) {
        this.customProperty.visibleInEditor = undefined
      } else {
        this.customProperty.visibleInEditor = false
      }
    })
    this.updateDisplay()
    this.onChange?.()
  }

  // called from the inspector.
  private get clickableInEditorInspector(): boolean {
    return this.customProperty.clickableInEditor ?? true
  }

  // called from the inspector.
  private set clickableInEditorInspector(value: boolean) {
    this.updateCustomProperty(() => {
      if (value) {
        this.customProperty.clickableInEditor = undefined
      } else {
        this.customProperty.clickableInEditor = false
      }
    })
    this.updatePickable()
    this.onChange?.()
  }

  // Called from the inspector.
  private get displayInspector(): number {
    const display = this._pomlElement.display
    switch (display) {
      case undefined:
      case 'visible': {
        return 0
      }
      case 'none': {
        return 1
      }
      case 'occlusion': {
        return 2
      }
      default: {
        let _: AssertTrue<IsNever<typeof display>>
        return 0
      }
    }
  }

  // Called from the inspector.
  private set displayInspector(value: number) {
    const a = [undefined, 'none', 'occlusion'] as const
    this._pomlElement.display = a[value]
    if (a[value] === undefined) {
      this._pomlElement.originalAttrs?.delete('display')
    }
    this.onChange?.()
  }

  // Called from the inspector.
  private get arDisplayInspector(): number {
    const arDisplay = this._pomlElement.arDisplay
    switch (arDisplay) {
      case 'visible': {
        return 0
      }
      case 'none': {
        return 1
      }
      case 'occlusion': {
        return 2
      }
      case undefined:
      case 'same-as-display': {
        return 3
      }
      default: {
        let _: AssertTrue<IsNever<typeof arDisplay>>
        return 3
      }
    }
  }

  // Called from the inspector.
  private set arDisplayInspector(value: number) {
    const a = ['visible', 'none', 'occlusion', undefined] as const
    this._pomlElement.arDisplay = a[value]
    if (a[value] === undefined) {
      this._pomlElement.originalAttrs?.delete('ar-display')
    }
    this.onChange?.()
  }

  // Called from the inspector.
  private get latitudeString(): string | undefined {
    return this.getFirstGeoReference()?.latitude?.toString()
  }

  // Called from the inspector.
  private set latitudeString(str: string | undefined) {
    this.setGeoReferenceProperty(str, 'latitude')
  }

  // Called from the inspector.
  private get longitudeString(): string | undefined {
    return this.getFirstGeoReference()?.longitude?.toString()
  }

  // Called from the inspector.
  private set longitudeString(str: string | undefined) {
    this.setGeoReferenceProperty(str, 'longitude')
  }

  // Called from the inspector.
  private get ellipsoidalHeightString(): string | undefined {
    return this.getFirstGeoReference()?.ellipsoidalHeight?.toString()
  }

  // Called from the inspector.
  private set ellipsoidalHeightString(str: string | undefined) {
    this.setGeoReferenceProperty(str, 'ellipsoidalHeight')
  }

  // Called from the inspector.
  private get rotationString(): string | undefined {
    const enuRotation = this.getFirstGeoReference()?.enuRotation
    if (enuRotation === undefined) {
      return undefined
    }

    const string = `${enuRotation.x} ${enuRotation.y} ${enuRotation.z} ${enuRotation.w}`
    return string
  }

  // Called from the inspector.
  private set rotationString(str: string | undefined) {
    this.setRotationProperty(str)
  }

  // Called from the inspector.
  private get idInspector(): string | undefined {
    return this._pomlElement.id
  }

  // Called from the inspector.
  private set idInspector(value: string | undefined) {
    const id = value?.trim() || undefined
    if (this._pomlElement.id !== id) {
      this._pomlElement.id = id
      this.onChange?.()
    }
  }

  // Called from the inspector.
  private get rotationModeInspector(): number {
    const m = this._pomlElement.rotationMode
    switch (m) {
      case undefined: {
        return 0
      }
      case 'billboard': {
        return 1
      }
      case 'vertical-billboard': {
        return 2
      }
      default: {
        let _: AssertTrue<IsNever<typeof m>>
        return 0
      }
    }
  }

  // Called from the inspector.
  private set rotationModeInspector(value: number) {
    const a = [undefined, 'billboard', 'vertical-billboard'] as const
    this._pomlElement.rotationMode = a[value]
    if (a[value] === undefined) {
      this._pomlElement.originalAttrs?.delete('rotation-mode')
    }
    this.onChange?.()
  }

  // Called from the inspector.
  private get isSpaceOrigin(): boolean {
    const spaceOrigin = this.customProperty.spaceOrigin
    if (spaceOrigin === undefined) {
      return false
    }
    return spaceOrigin.enabled ?? false
  }

  // Called from the inspector.
  private set isSpaceOrigin(value: boolean) {
    this.updateCustomProperty(() => {
      if (value === true) {
        if (this.customProperty.spaceOrigin === undefined) {
          this.customProperty.spaceOrigin = {
            enabled: true,
          }
        } else {
          this.customProperty.spaceOrigin.enabled = true
        }
      } else {
        if (this.customProperty.spaceOrigin !== undefined) {
          this.customProperty.spaceOrigin.enabled = false
        }
      }

      this.removeEmptySpaceOriginProperty()
    })

    this.updateSpaceOriginInspector()
    this.onChange?.()
  }

  // Called from the inspector.
  private get spaceOriginSpaceId(): string {
    return this.customProperty.spaceOrigin?.spaceId ?? ''
  }

  // Called from the inspector.
  private set spaceOriginSpaceId(value: string) {
    this.updateCustomProperty(() => {
      if (this.customProperty.spaceOrigin === undefined) {
        this.customProperty.spaceOrigin = {
          spaceId: value,
        }
      } else {
        this.customProperty.spaceOrigin.spaceId = value
      }
      this.removeEmptySpaceOriginProperty()
    })
    this.onChange?.()
  }

  // Called from the inspector.
  private get spaceOriginSpaceType(): string {
    return this.customProperty.spaceOrigin?.spaceType ?? ''
  }

  // Called from the inspector.
  private set spaceOriginSpaceType(value: string) {
    this.updateCustomProperty(() => {
      if (this.customProperty.spaceOrigin === undefined) {
        this.customProperty.spaceOrigin = {
          spaceType: value,
        }
      } else {
        this.customProperty.spaceOrigin.spaceType = value
      }
      this.removeEmptySpaceOriginProperty()
    })
    this.onChange?.()
  }

  private setGeoReferenceProperty(
    str: string | undefined,
    propertyName: 'latitude' | 'longitude' | 'ellipsoidalHeight'
  ) {
    const value = (() => {
      if (str === undefined) {
        return undefined
      }
      const v = Number.parseFloat(str)
      return Number.isNaN(v) ? undefined : v
    })()

    // Do not update GeoReference when the number is not obtained.
    if (value === undefined) {
      return
    }

    let geoReference = this.getFirstGeoReference()
    if (geoReference === undefined) {
      geoReference = { type: 'geo-reference' }
      this._pomlElement.coordinateReferences.push(geoReference)
    }
    geoReference[propertyName] = value
    this.loadGeoReference()
    this.onChange?.()
  }

  private setRotationProperty(str: string | undefined) {
    const rotation = parseQuaternion(str)

    // Do not update GeoReference when parse failed
    if (rotation === undefined) {
      return
    }

    const geoReference = this.getFirstGeoReference()
    if (geoReference === undefined) {
      return
    }

    geoReference.enuRotation = rotation
    this.loadGeoReference()
    this.onChange?.()
  }

  constructor(pomlElement: T, params: CreateNodeParams, name?: string) {
    name = name ?? pomlElement.type
    const scene = params.scene
    super(name, scene)
    this.app = getApp(scene)
    this.gizmoController = this.app.gizmoController
    this._pomlElement = pomlElement
    this._parentSpirareNode = params.parentNode

    // In AR display mode, if SpaceReference is set, this node is hidden at the time of loading.
    if (this.app.runMode === 'viewer' && this.app.isArMode) {
      const hasSpaceReference = pomlElement.coordinateReferences.some(
        (coordinateRefenrece) => {
          return (
            coordinateRefenrece.type === 'space-reference' &&
            coordinateRefenrece.spaceId
          )
        }
      )

      if (hasSpaceReference) {
        this.setEnabled(false)
      }
    }

    this.applyElementToNode()

    // Load custom property.
    const customAttributeValue =
      pomlElement.customAttributes.get(customAttributeKey)
    if (customAttributeValue !== undefined) {
      try {
        // TODO: check property type
        this.customProperty = JSON.parse(customAttributeValue)
      } catch {}
    }

    if (this.app.runMode == 'viewer') {
      this.scriptComponents = pomlElement.scriptElements.map(
        (x) => new ScriptElementComponent(x, params.store)
      )
      this.scriptComponents.forEach((x) => x.instantiateAsync())
    } else {
      this.scriptComponents = []
    }

    const clickAction = new ExecuteCodeAction(
      ActionManager.OnPickTrigger,
      (e) => {
        this.onClick?.(this.asSpirareNode)
      }
    )
    this.actionManager = new ActionManager(scene)
    this.actionManager.registerAction(clickAction)

    const onOriginChangedEventListener: OnOriginChangedEventListener = (_) => {
      this.loadGeoReference()
    }

    const beforeOriginChangedEventListener: BeforeOriginChangedEventListener = (
      _
    ) => {
      if (this.geoPlacement) {
        this.updateGeoreference()
      }
    }

    // If the geodetic position of the origin is changed, update the position of SpirareNode.
    this.app.geoManager.onOriginChanged.add(
      onOriginChangedEventListener,
      beforeOriginChangedEventListener
    )

    this.onDisposeObservable.add(() => {
      this.app.geoManager.onOriginChanged.remove(
        onOriginChangedEventListener,
        beforeOriginChangedEventListener
      )
    })

    scene.onAfterRenderObservable.add(() => {
      if (this.checkIfTransformChangedWithInspector()) {
        this.updateElement()
        this.onChange?.()
      }
    })

    scene.onBeforeRenderObservable.add(() => {
      if (this.app.runMode == 'viewer') {
        // rotation-mode
        if (this._pomlElement.rotationMode !== undefined) {
          switch (this._pomlElement.rotationMode) {
            case 'billboard': {
              const cameraBackward = this.app.camera.getDirection(
                new Vector3(0, 0, -1)
              )
              const target = this.absolutePosition.add(cameraBackward)
              this.lookAt(target, undefined, undefined, undefined, Space.WORLD)
              break
            }
            case 'vertical-billboard': {
              const target = this.app.camera.position
              target.y = this.absolutePosition.y
              this.lookAt(target, undefined, undefined, undefined, Space.WORLD)
              break
            }
          }
        }

        // scale-by-distance
        const scaleByDistance = this._pomlElement.scaleByDistance
        if (scaleByDistance !== undefined && scaleByDistance !== false) {
          const distance = Vector3.Distance(
            this.absolutePosition,
            this.app.camera.position
          )

          const factor = scaleByDistance === true ? 1 : scaleByDistance

          const scale = this._pomlElement.scale ?? 1
          let scaling = CoordinateConverter.toBabylonScale(scale).scale(
            factor * distance
          )

          if (this._pomlElement.minScale) {
            const minScale = CoordinateConverter.toBabylonScale(
              this._pomlElement.minScale
            )
            scaling.x = Math.max(scaling.x, minScale.x)
            scaling.y = Math.max(scaling.y, minScale.y)
            scaling.z = Math.max(scaling.z, minScale.z)
          }
          if (this._pomlElement.maxScale) {
            const maxScale = CoordinateConverter.toBabylonScale(
              this._pomlElement.maxScale
            )
            scaling.x = Math.min(scaling.x, maxScale.x)
            scaling.y = Math.min(scaling.y, maxScale.y)
            scaling.z = Math.min(scaling.z, maxScale.z)
          }
          this.scaling = scaling
        }

        this.invokeSpirareEvent('update')
      }
    })

    // Custom inspector
    if (this.inspectableCustomProperties === undefined) {
      this.inspectableCustomProperties = []
    }

    // Action buttons for editor mode and viewer mode
    this.inspectableCustomProperties.push({
      label: 'Focus',
      propertyName: '',
      type: InspectableType.Button,
      callback: () => {
        this.app.cameraController.adjust(this, true)
      },
    })

    if (this.app.runMode === 'editor') {
      // Action buttons for editor mode
      this.inspectableCustomProperties.push({
        label: 'Select',
        propertyName: '',
        type: InspectableType.Button,
        callback: () => {
          this.app.selectElement(this.asSpirareNode)
        },
      })

      // Settings for Editor
      this.inspectableCustomProperties.push(
        {
          label: '==== Settings for Editor ====',
          propertyName: '',
          type: InspectableType.Tab,
        },
        {
          label: 'Visible in Editor',
          propertyName: 'visibleInEditorInspector',
          type: InspectableType.Checkbox,
        },
        {
          label: 'Clickable in Editor',
          propertyName: 'clickableInEditorInspector',
          type: InspectableType.Checkbox,
        }
      )

      // Settings for generic element
      this.inspectableCustomProperties.push(
        {
          label: '==== Generic Element Settings ====',
          propertyName: '',
          type: InspectableType.Tab,
        },
        {
          label: 'Poml Element Id',
          propertyName: 'idInspector',
          type: InspectableType.String,
        },
        {
          label: 'Display Mode',
          propertyName: 'displayInspector',
          type: InspectableType.Options,
          options: [
            {
              label: 'visible',
              value: 0,
            },
            {
              label: 'hidden',
              value: 1,
            },
            {
              label: 'as occlusion',
              value: 2,
            },
          ],
        },
        {
          label: 'AR Display Mode',
          propertyName: 'arDisplayInspector',
          type: InspectableType.Options,
          options: [
            {
              label: 'visible',
              value: 0,
            },
            {
              label: 'hidden',
              value: 1,
            },
            {
              label: 'as occlusion',
              value: 2,
            },
            {
              label: 'same as display mode',
              value: 3,
            },
          ],
        },
        {
          label: 'RotationMode',
          propertyName: 'rotationModeInspector',
          type: InspectableType.Options,
          options: [
            {
              label: '---',
              value: 0,
            },
            {
              label: 'billboard',
              value: 1,
            },
            {
              label: 'vertical-billboard',
              value: 2,
            },
          ],
        }
      )

      if (this.app.placementMode === 'space') {
        this.inspectableCustomProperties.push({
          label: 'Space origin',
          propertyName: 'isSpaceOrigin',
          type: InspectableType.Checkbox,
        })

        this.updateSpaceOriginInspector()
      }

      if (this.app.placementMode === 'geodetic') {
        this.inspectableCustomProperties.push(
          {
            label: 'Latitude',
            propertyName: 'latitudeString',
            type: InspectableType.String,
          },
          {
            label: 'Longitude',
            propertyName: 'longitudeString',
            type: InspectableType.String,
          },
          {
            label: 'Ellipsoidal Height',
            propertyName: 'ellipsoidalHeightString',
            type: InspectableType.String,
          },
          {
            label: 'Rotation',
            propertyName: 'rotationString',
            type: InspectableType.String,
          }
        )
      }
    }
  }

  public updateElement() {
    const element = this.element
    element.position = CoordinateConverter.toSpirarePosition(this.position)

    // If scaling is performed based on distance, do not change element.scale.
    if (
      this.app.runMode !== 'viewer' ||
      element.scaleByDistance === undefined
    ) {
      element.scale = CoordinateConverter.toSpirareScale(this.scaling)
    }
    const rot = this.rotationQuaternion
    element.rotation = rot
      ? CoordinateConverter.toSpirareQuaternion(rot)
      : undefined

    if (this.geoPlacement) {
      this.updateGeoreference()
    }
  }

  public registerEventCallback(
    eventType: SpirareEventType,
    callback: () => void
  ) {
    let observable = this.eventObservableMap.get(eventType)
    if (observable === undefined) {
      observable = new Observable()
      this.eventObservableMap.set(eventType, observable)
    }

    observable.add(callback)
  }

  public activateScriptComponents() {
    this.scriptComponentsActivated = true
  }

  public invokeSpirareEvent(eventType: InvokableSpirareEventType) {
    if (this.scriptComponentsActivated === false) {
      return
    }

    this.scriptComponents.map((x) => x.invokeSpirareEvent(eventType))

    const observable = this.eventObservableMap.get(eventType)
    observable?.notifyObservers()
  }

  /**
   * Reflect the value of element to SpirareNode.
   */
  private applyElementToNode() {
    const element = this.element
    const pos = element.position ?? new Vector3(0, 0, 0)
    const rot = element.rotation ?? new Quaternion(0, 0, 0, 1)
    const scale = element.scale ?? 1

    this.position = CoordinateConverter.toBabylonPosition(pos)
    this.rotationQuaternion = CoordinateConverter.toBabylonQuaternion(rot)
    this.scaling = CoordinateConverter.toBabylonScale(scale)

    this.loadGeoReference()
  }

  /**
   * Update element partially in Play mode.
   * @param diff
   * @returns
   */
  public updateData(diff: Partial<T>) {
    // Update element itself.
    if (diff.id === this.elementId) {
      Object.assign(this.element, diff)
      if (diff.position) {
        this.position = CoordinateConverter.toBabylonPosition(diff.position)
      }
      if (diff.scale) {
        this.scaling = CoordinateConverter.toBabylonScale(diff.scale)
      }
      if (diff.rotation) {
        this.rotationQuaternion = CoordinateConverter.toBabylonQuaternion(
          diff.rotation
        )
      }
      if (diff.display) {
        this.updateDisplay()
      }
      return
    }

    const targetReference = this._pomlElement.coordinateReferences?.find(
      (x) => x.id === diff.id
    )

    if (targetReference !== undefined) {
      // Update CoordinateReference.
      if (targetReference.type === 'geo-reference') {
        const geoReferenceDiff = diff as Partial<GeoReference>
        let geoReferenceChanged = false

        if (geoReferenceDiff.latitude) {
          targetReference.latitude = geoReferenceDiff.latitude
          geoReferenceChanged = true
        }
        if (geoReferenceDiff.longitude) {
          targetReference.longitude = geoReferenceDiff.longitude
          geoReferenceChanged = true
        }
        if (geoReferenceDiff.ellipsoidalHeight) {
          targetReference.ellipsoidalHeight = geoReferenceDiff.ellipsoidalHeight
          geoReferenceChanged = true
        }
        if (geoReferenceDiff.enuRotation) {
          targetReference.enuRotation = geoReferenceDiff.enuRotation
          geoReferenceChanged = true
        }

        if (geoReferenceChanged) {
          this.loadGeoReference()
        }
      }
    }
  }

  public updateSpaceStatus(status: SpaceStatus): void {
    const targetReference = this.element.coordinateReferences.find(
      (coordinateReference) => {
        if (coordinateReference.type !== 'space-reference') {
          return false
        }

        if (
          !coordinateReference.spaceType ||
          coordinateReference.spaceType.toLowerCase() ===
            status.spaceType.toLowerCase()
        ) {
          if (coordinateReference.spaceId === status.spaceId) {
            return true
          }
        }
        return false
      }
    )

    if (targetReference?.type === 'space-reference') {
      if (status.type == 'updated') {
        const objectOriginToSpacePose = {
          position: targetReference.position ?? { x: 0, y: 0, z: 0 },
          rotation: targetReference.rotation ?? { x: 0, y: 0, z: 0, w: 1 },
        }

        const objectPose = SpirareNodeBase.spacePoseToObjectOriginPose(
          objectOriginToSpacePose,
          status
        )
        this.position = objectPose.position
        this.rotationQuaternion = objectPose.rotation

        this.setEnabled(true)
      } else if (status.type === 'lost') {
        this.setEnabled(false)
      }
    }
  }

  protected updateNodeObjectStatus(): void {
    this.updatePickable()
    this.updateActionManager()
    this.updateDisplay()
    this.updateLayerMask()
  }

  private updatePickable(): void {
    const pickable = this.clickableInEditorInspector
    this.meshes.forEach((mesh) => {
      mesh.isPickable = pickable
    })
    if (pickable === false) {
      if (this.gizmoController.attachedNode === this) {
        this.gizmoController.detach()
      }
    }
  }

  private updateActionManager(): void {
    this.meshes.forEach((mesh) => {
      mesh.actionManager = this.actionManager
    })
  }

  private updateDisplay(): void {
    let display: Display = 'visible'

    // TODO: Support occlusion
    // As a temporary measure, handle the following cases when occlusion is set:
    // - AR mode: hidden
    // - Normal mode: displayed

    if (this.isEditorMode) {
      display = this.visibleInEditorInspector ? 'visible' : 'none'
    }

    if (this.isViewerMode) {
      if (this.app.isArMode) {
        display = this.arDisplayInHierarchy
        if (display === 'occlusion') {
          display = 'none'
        }
      } else {
        display = this.displayInHierarchy
        if (display === 'occlusion') {
          display = 'visible'
        }
      }
    }

    switch (display) {
      case 'visible':
        showMeshes(this.meshes)
        return
      case 'none':
        hideMeshes(this.meshes)
        if (this.gizmoController.attachedNode === this) {
          this.gizmoController.detach()
        }
        return
      default:
        const unreachable: never = display
        break
    }
  }

  protected updateLayerMask(): void {
    this.meshes.forEach((mesh) => {
      mesh.layerMask = this.layerMask
    })
  }

  /**
   * Update the coordinateReferences of the element based on its Babylon position.
   */
  private updateGeoreference() {
    const geoManager = this.app.geoManager

    let geoReference = this.getFirstGeoReference()

    // Add a new GeoReference if it doesn't exist.
    if (geoReference === undefined) {
      geoReference = {
        type: 'geo-reference',
      }
      if (this._pomlElement.coordinateReferences === undefined) {
        this._pomlElement.coordinateReferences = [geoReference]
      } else {
        this._pomlElement.coordinateReferences.push(geoReference)
      }
    }

    // Set the latitude and longitude of the GeoReference.
    const geoPosition = geoManager.babylonPositionToGeodeticPosition(
      this.position
    )
    Object.assign(geoReference, geoPosition)

    if (this.rotationQuaternion) {
      const enuRotation = geoManager.babylonRotationToSpirareEnuRotation(
        this.rotationQuaternion,
        geoPosition
      )
      geoReference.enuRotation = enuRotation
    }

    this.element.position = undefined
    this.element.originalAttrs?.delete('position')

    this.element.rotation = undefined
    this.element.originalAttrs?.delete('rotation')
  }

  /**
   * Reflects the GeoReference of the element to the position of the SpirareNode.
   */
  private loadGeoReference() {
    const geoManager = this.app.geoManager

    const geoReference = this.getFirstGeoReference()
    if (geoReference === undefined) {
      return
    }

    if (
      geoReference.latitude !== undefined &&
      geoReference.longitude !== undefined &&
      geoReference.ellipsoidalHeight !== undefined
    ) {
      const geodeticPosition = {
        latitude: geoReference.latitude,
        longitude: geoReference.longitude,
        ellipsoidalHeight: geoReference.ellipsoidalHeight,
      }
      const babylonPosition =
        geoManager.geodeticPositionToBabylonPosition(geodeticPosition)
      this.position = babylonPosition

      const toNormalizedQuaternion = (rotation: Rotation | undefined) => {
        if (rotation === undefined) {
          return new Quaternion(0, 0, 0, 1)
        }

        return new Quaternion(
          rotation.x,
          rotation.y,
          rotation.z,
          rotation.w
        ).normalize()
      }

      const elementRotation = toNormalizedQuaternion(this.element.rotation)
      const geoReferenceRotation = toNormalizedQuaternion(
        geoReference.enuRotation
      )

      const combinedRotation = geoReferenceRotation.multiply(elementRotation)

      const rotationQuaternion = geoManager.spirareEnuRotationToBabylonRotation(
        combinedRotation,
        geodeticPosition
      )
      this.rotationQuaternion = rotationQuaternion
    }
  }

  /**
   * Check if the transform has been modified in the Inspector.
   * @returns
   */
  private checkIfTransformChangedWithInspector(): boolean {
    if (this.gizmoController.isBeingDragged) {
      return false
    }

    if (this.element.position) {
      const pos = CoordinateConverter.toBabylonPosition(this.element.position)
      if (this.position.equalsWithEpsilon(pos, 0.0001) == false) {
        return true
      }
    }

    if (this.element.rotation && this.rotationQuaternion) {
      const rot = CoordinateConverter.toBabylonQuaternion(this.element.rotation)
      if (this.rotationQuaternion.equalsWithEpsilon(rot, 0.00001) == false) {
        return true
      }
    }

    if (this.element.scale) {
      const scale = CoordinateConverter.toBabylonScale(this.element.scale)
      if (this.scaling.equalsWithEpsilon(scale, 0.0001) == false) {
        return true
      }
    }

    if (this.geoPlacement) {
      const equalsWithEpsilon = (
        a: number,
        b: number,
        epsilon: number
      ): boolean => {
        return Math.abs(a - b) <= epsilon
      }

      const rotationEqualsWithEpsilon = (
        a: Rotation,
        b: Rotation,
        epsilon: number
      ): boolean => {
        return (
          equalsWithEpsilon(a.x, b.x, epsilon) &&
          equalsWithEpsilon(a.y, b.y, epsilon) &&
          equalsWithEpsilon(a.z, b.z, epsilon) &&
          equalsWithEpsilon(a.w, b.w, epsilon)
        )
      }

      // Consider it as moved if it has changed by around 0.1 mm.
      const latLonEpsilon = 0.00001 * 0.0001
      const heightEpsilon = 0.0001

      const firstGeoReference = this.getFirstGeoReference()

      if (firstGeoReference) {
        const geoPosition =
          this.app.geoManager.babylonPositionToGeodeticPosition(this.position)

        if (
          firstGeoReference.latitude &&
          equalsWithEpsilon(
            firstGeoReference.latitude,
            geoPosition.latitude,
            latLonEpsilon
          ) == false
        ) {
          return true
        }

        if (
          firstGeoReference.longitude &&
          equalsWithEpsilon(
            firstGeoReference.longitude,
            geoPosition.longitude,
            latLonEpsilon
          ) == false
        ) {
          return true
        }

        if (
          firstGeoReference.ellipsoidalHeight &&
          equalsWithEpsilon(
            firstGeoReference.ellipsoidalHeight,
            geoPosition.ellipsoidalHeight,
            heightEpsilon
          ) == false
        ) {
          return true
        }

        if (this.rotationQuaternion) {
          const enuRotation =
            this.app.geoManager.babylonRotationToSpirareEnuRotation(
              this.rotationQuaternion,
              geoPosition
            )

          if (
            firstGeoReference.enuRotation &&
            rotationEqualsWithEpsilon(
              firstGeoReference.enuRotation,
              enuRotation,
              0.0000001
            ) == false
          ) {
            return true
          }
        }
      }
    }

    return false
  }

  /**
   * Returns the first GeoReference of the element.
   * @returns GeoReference object or undefined.
   */
  private getFirstGeoReference(): GeoReference | undefined {
    const coordinateReferences = this.element.coordinateReferences
    const geoReference = coordinateReferences.find(
      (x) => x.type === 'geo-reference'
    )
    if (geoReference === undefined || geoReference.type !== 'geo-reference') {
      return undefined
    }
    return geoReference
  }

  private updateCustomProperty(func: () => void): void {
    func()

    const value = JSON.stringify(this.customProperty)
    if (value === '{}') {
      this._pomlElement.customAttributes.delete(customAttributeKey)
      this._pomlElement.originalAttrs?.delete(`_${customAttributeKey}`)
    } else {
      this._pomlElement.customAttributes.set(customAttributeKey, value)
    }
  }

  private removeEmptySpaceOriginProperty() {
    const spaceOrigin = this.customProperty.spaceOrigin
    if (spaceOrigin === undefined) {
      return
    }

    if (spaceOrigin.enabled) {
      return
    }
    if (spaceOrigin.spaceId) {
      return
    }
    if (spaceOrigin.spaceType) {
      return
    }

    this.customProperty.spaceOrigin = undefined
  }

  private updateSpaceOriginInspector() {
    const spaceIdLabel = 'Space origin space id'
    const spaceIdIndex = this.inspectableCustomProperties.findIndex(
      (x) => x.label === spaceIdLabel
    )

    const spaceTypeLabel = 'Space origin space type'
    const spaceTypeIndex = this.inspectableCustomProperties.findIndex(
      (x) => x.label === spaceTypeLabel
    )

    if (this.isSpaceOrigin) {
      const spaceOriginIndex = this.inspectableCustomProperties.findIndex(
        (x) => x.propertyName === 'isSpaceOrigin'
      )

      if (spaceOriginIndex === -1) {
        return
      }

      if (spaceIdIndex === -1) {
        this.inspectableCustomProperties.splice(spaceOriginIndex + 1, 0, {
          label: spaceIdLabel,
          propertyName: 'spaceOriginSpaceId',
          type: InspectableType.String,
        })
      }

      if (spaceTypeIndex === -1) {
        this.inspectableCustomProperties.splice(spaceOriginIndex + 2, 0, {
          label: spaceTypeLabel,
          propertyName: 'spaceOriginSpaceType',
          type: InspectableType.String,
        })
      }
    } else {
      if (spaceTypeIndex !== -1) {
        this.inspectableCustomProperties.splice(spaceTypeIndex, 1)
      }

      if (spaceIdIndex !== -1) {
        this.inspectableCustomProperties.splice(spaceIdIndex, 1)
      }
    }
  }

  private static spacePoseToObjectOriginPose(
    objectOriginToSpacePose: Pose,
    worldToSpacePose: Pose
  ): { position: Vector3; rotation: Quaternion } {
    const spaceBabylonPosition = CoordinateConverter.toBabylonPosition(
      objectOriginToSpacePose.position
    )
    const spaceBabylonRotation = CoordinateConverter.toBabylonQuaternion(
      objectOriginToSpacePose.rotation
    )

    const objectOriginToSpace = Matrix.Compose(
      Vector3.One(),
      spaceBabylonRotation,
      spaceBabylonPosition
    )

    const spaceToObjectOrigin = objectOriginToSpace.invert()

    const pos = worldToSpacePose.position
    const worldToSpacePosition = new Vector3(pos.x, pos.y, pos.z)

    const rot = worldToSpacePose.rotation
    const q = new Quaternion(rot.x, rot.y, rot.z, rot.w)
    const rot180 = Quaternion.FromEulerAngles(0, Math.PI, 0)
    const worldToSpaceRotation = rot180.multiply(q)

    const worldToSpace = Matrix.Compose(
      Vector3.One(),
      worldToSpaceRotation,
      worldToSpacePosition
    )

    const worldToObjectOrigin = spaceToObjectOrigin.multiply(worldToSpace)

    const objectOriginPosition = worldToObjectOrigin.getTranslation()
    const objectOriginRotation = Quaternion.FromRotationMatrix(
      worldToObjectOrigin.getRotationMatrix()
    )

    return {
      position: objectOriginPosition,
      rotation: objectOriginRotation,
    }
  }
}
