import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'
import '@babylonjs/loaders/glTF'
import {
  Engine,
  Scene,
  TargetCamera,
  Vector3,
  HemisphericLight,
  AxesViewer,
  IHighlightLayerOptions,
  Mesh,
  HighlightLayer,
  Color3,
  Color4,
  ArcRotateCamera,
  KeyboardEventTypes,
  Quaternion,
} from '@babylonjs/core'
import {
  AdvancedDynamicTexture,
  InputText,
  Control,
  ScrollViewer,
  Grid,
  TextBlock,
  Button,
} from '@babylonjs/gui'
import { Guid } from 'guid-typescript'
import { LoadPomlOptions, PomlLoader } from './pomlLoader'
import { PomlBuilder } from './pomlBuilder'
import {
  CoordinateReference,
  PomlModelElement,
  PomlImageElement,
  Poml,
  PomlVideoElement,
  PomlTextElement,
  PomlEmptyElement,
  PomlElement,
  MaybePomlElement,
  ScriptElement,
} from 'ts-poml'
import { BuildOptions } from 'ts-poml/dist/pomlParser'
import { UIHelper } from './uiHelper'
import { IOHelper } from './ioHelper'
import {
  findSpirareNodes,
  MaybeSpirareNode,
  SpirareNode,
} from './spirareNode/spirareNode'
import { GizmoController, GizmoMode } from './gizmoController'
import { GeoManager } from './cesium/geoManager'
import { B3dmLoader } from './cesium/b3dmLoader'
import {
  CameraController,
  CameraControllerOptions,
} from './camera/cameraController'
import { ICameraController } from './camera/iCameraController'
import { CesiumManager, CesiumManagerOptions } from './cesiumManager'
import { HistoryManager } from './historyManager'
import AsyncLock from 'async-lock'
import { Streaming3dTiles, TilesetData } from './plateau/streaming3dTiles'
import { WebSocketComm } from './comm/webSocketComm'
import { TilesLoader } from './cesium/tilesLoader'
import { TerrainController } from './cesium/terrainController'
import { GroundGridController } from './groundGridController'
import {
  AppRunMode,
  UploadFileResult,
  FileData,
  PlacementMode,
  SourceResolver,
  AppLaunchParams,
  SpaceStatus,
  AppDisplayMode,
  ServerUrlResult,
} from './types'
import { CoordinateConverter } from './coordinateConverter'
import { openFilePicker } from './filePicker'
import clone from 'clone'

import homeIcon from './images/home_door.svg'
import gizmoNoneIcon from './images/hand.png'
import gizmoScaleIcon from './images/scale.png'
import gizmoRotationIcon from './images/refresh_alt.png'
import gizmoPositionIcon from './images/move.png'
import shareIcon from './images/share_alt.svg'

export type CameraControllerFactory = (
  app: App,
  scene: Scene,
  canvas: HTMLCanvasElement
) => ICameraController

const defaultCameraControllerFactory: CameraControllerFactory = (
  app: App,
  scene: Scene,
  canvas: HTMLCanvasElement
): ICameraController => {
  const isGeodeticMode = app.isGeodeticMode

  const cameraOptions: CameraControllerOptions = {
    maxZ: isGeodeticMode ? 0 : 10000,
    upperRadiusLimit: isGeodeticMode ? 40000000 : 10000,
    lowerRadiusLimit: 0.01,
  }

  const cameraController = new CameraController(
    scene,
    canvas,
    app.isGeodeticMode ? app.geoManager : undefined,
    cameraOptions
  )

  return cameraController
}

type TerrainType = 'Cesium' | '3DTiles'
type AppParams = {
  launchParams: AppLaunchParams
  cameraControllerFactory?: CameraControllerFactory
}

export const createAppAsync = async (params: AppParams) => {
  let cesiumManager: CesiumManager | undefined
  if (params.launchParams.placementMode === 'geodetic') {
    cesiumManager = new CesiumManager()
    const options: CesiumManagerOptions = {
      imageryType: TERRAIN_TILESET_URL ? 'None' : 'PLATEAU',
    }
    await cesiumManager.initializeAsync(options)
  }

  const app = new App(params, cesiumManager)
  return app
}

export class App {
  private engine: Engine
  private scene: Scene

  private cesiumManager: CesiumManager | undefined
  private terrainController: TerrainController | undefined
  private groundGridController: GroundGridController | undefined

  private highlightLayer: HighlightLayer
  private ui: AdvancedDynamicTexture | undefined
  private hintUI: Control | undefined
  private startPageUrl?: string

  private _title: string | undefined
  private _runMode: AppRunMode
  private _displayMode: AppDisplayMode
  public readonly placementMode: PlacementMode

  private pomlLoader: PomlLoader
  private readonly pomlBuilder: PomlBuilder = new PomlBuilder()
  private cameraTargetHeight: number = 0

  private selectedNode: SpirareNode | undefined

  private readonly historyManager: HistoryManager = new HistoryManager()

  private readonly asyncLock = new AsyncLock()
  private readonly sceneLockKey = 'scene-lock-key'

  public readonly cameraController: ICameraController
  public readonly gizmoController: GizmoController
  public readonly geoManager: GeoManager = new GeoManager()
  public readonly tilesLoader: TilesLoader = new TilesLoader(this.geoManager)
  public readonly pomlId: string

  private sceneScriptElements: ScriptElement[] = []
  private terrainType: TerrainType
  private dataAttribution: string[] = []
  private dataAttributionTextBlock: TextBlock | undefined

  private gizmoModeButtons = new Map<GizmoMode, Button>()

  public get title(): string | undefined {
    return this._title
  }

  public set title(title: string | undefined) {
    if (this._title === title) {
      return
    }
    this._title = title
    const input = UIHelper.getControl(this.ui, 'titleInput', InputText)
    if (input !== undefined && input.text !== title) {
      input.text = title ?? ''
    }
    this.onEdit()
  }

  public sourceResolver: SourceResolver | undefined

  public onChange?: () => void

  public get camera(): TargetCamera {
    return this.cameraController.camera
  }

  public get runMode(): AppRunMode {
    return this._runMode
  }

  public get isArMode(): boolean {
    return this._displayMode === 'ar'
  }

  public get isGeodeticMode(): boolean {
    return this.placementMode == 'geodetic'
  }

  constructor(params: AppParams, cesiumManager: CesiumManager | undefined) {
    const launchParams = params.launchParams
    this.startPageUrl = launchParams.startPageUrl

    if (launchParams.pomlId === undefined) {
      switch (launchParams.runMode) {
        case 'viewer':
          this.pomlId = ''
          break
        case 'editor':
          this.pomlId = Guid.create().toString()

          // Modify the URL of the browser to include the pomlId
          let pageUrl = window.location.href
          if (window.location.search) {
            // If the URL already has query parameters
            pageUrl = `${pageUrl}&pomlId=${this.pomlId}`
          } else {
            // If the URL does not have any query parameters
            pageUrl = `${pageUrl}?pomlId=${this.pomlId}`
          }

          window.history.replaceState(null, '', pageUrl)
          break
      }
    } else {
      this.pomlId = launchParams.pomlId
    }

    this._title = undefined
    this._runMode = launchParams.runMode
    this._displayMode = launchParams.displayMode ?? 'normal'

    this.placementMode = launchParams.placementMode
    const isGeodeticMode = this.isGeodeticMode
    const isEditorMode = this._runMode === 'editor'

    this.cesiumManager = cesiumManager

    const canvas = document.getElementById('spirare_canvas')
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas is not found')
    }

    this.engine = new Engine(canvas, true)
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
    const scene = new Scene(this.engine)

    // Add "app" to the metadata of the scene, so that the app can be accessed from the scene.
    scene.metadata = {
      ...scene.metadata,
      app: this,
    }

    this.scene = scene

    this.terrainType = TERRAIN_TILESET_URL ? '3DTiles' : 'Cesium'

    if (isGeodeticMode) {
      switch (this.terrainType) {
        case 'Cesium': {
          scene.clearColor = new Color4(0, 0, 0, 0)
          if (this.cesiumManager !== undefined) {
            this.terrainController = new TerrainController(
              this.cesiumManager,
              this.geoManager
            )
          }
          break
        }
        case '3DTiles':
          {
            this.tilesLoader.loadAsync(
              TERRAIN_TILESET_URL,
              'Terrain',
              this,
              this.scene
            )
          }
          break
      }
    }

    const cameraControllerFactory =
      params.cameraControllerFactory ?? defaultCameraControllerFactory

    this.cameraController = cameraControllerFactory(this, scene, canvas)
    this.cameraController.restoreCameraPose()

    const light = new HemisphericLight('Light', new Vector3(1, 1, 0), scene)

    // Set renderingGroupId to use with AxesViewer
    // https://forum.babylonjs.com/t/problem-mixing-highlightlayer-and-axesviewer/27781
    var options: Partial<IHighlightLayerOptions> = {
      isStroke: false,
      blurHorizontalSize: 0.3,
      blurVerticalSize: 0.3,
      renderingGroupId: 0,
    }

    this.highlightLayer = new HighlightLayer('highlightLayer', scene, options)

    if (!isGeodeticMode && launchParams.hideOriginAxes === false) {
      this.createWorldAxesViewer()
    }

    if (!isGeodeticMode) {
      if (
        launchParams.showGroundGrid === true ||
        (launchParams.showGroundGrid === undefined && isEditorMode)
      ) {
        this.createGroundGrid()
      }
    }

    if (launchParams.hideInspector !== true) {
      scene.debugLayer.show({
        embedMode: true,
        enablePopup: false,
        enableClose: false,
      })
    }

    this.gizmoController = new GizmoController(scene)
    this.gizmoController.onChange = () => {
      this.onEdit()
    }

    this.pomlLoader = new PomlLoader()

    if (isEditorMode) {
      this.listenFileDrop()
      this.listenKeyDown()
    }

    if (launchParams.hideUI !== true) {
      this.ui = AdvancedDynamicTexture.CreateFullscreenUI('UI').addControl(
        this.createUI()
      )

      // Create Cesium.js data attibution UI
      if (isGeodeticMode) {
        const cesiumIonLogo = this.createCesiumIonLogo()
        this.ui.addControl(cesiumIonLogo)

        const dataAttributionUI = this.createCesiumJsDataAttributionUI()
        this.ui.addControl(dataAttributionUI)

        switch (this.terrainType) {
          case '3DTiles': {
            this.dataAttributionTextBlock = this.createDataAttributionText()
            this.updateDataAttributionText()
            this.ui.addControl(this.dataAttributionTextBlock)
            break
          }
        }
      }

      const hintUIOffset = isGeodeticMode ? 40 : 0
      this.hintUI = this.createHintUI(hintUIOffset)
      this.ui.addControl(this.hintUI)
      if (!isEditorMode) {
        this.hintUI.isVisible = false
      }
    }

    this.updateCameraTargetTerrainHeight()
    this.updateTerrainLoop()

    this.scene.registerBeforeRender(() => {
      this.cameraController.alignWithTerrain(this.cameraTargetHeight)
    })

    this.engine.runRenderLoop(() => {
      this.tilesLoader.update(this.camera)

      if (this.isGeodeticMode) {
        // Update the latitude and longitude of the Babylon.js coordinate system's origin
        // if the camera's target has moved more than 10 km.
        const cameraTarget = this.camera.target
        if (cameraTarget.length() > 10000) {
          const ecefCameraTarget =
            this.geoManager.babylonPositionToEcefPosition(cameraTarget)
          this.geoManager.changeOrigin(ecefCameraTarget)
        }
      }

      this.groundGridController?.updateGrid(this.camera)

      this.scene.render()

      if (this.cesiumManager) {
        this.cesiumManager.syncBabylonCameraToCesiumCamera(
          this.camera,
          this.geoManager.origin
        )
        this.cesiumManager.render()
      }
    })

    // Register the initial state
    this.asyncLock.acquire(this.sceneLockKey, async () => {
      const poml = await this.buildPoml()
      this.historyManager.setInitialState(poml)
    })

    // If in viewer mode, load the poml files specified in pomlUrlArray
    if (this._runMode === 'viewer') {
      launchParams.pomlUrlArray?.forEach((pomlUrl) => {
        console.log(pomlUrl)

        const options: LoadPomlOptions = {
          createSceneRootNode: true,
        }
        this.loadPomlAsync({ url: pomlUrl }, options)
      })
    }
  }

  private updateCameraTargetTerrainHeight() {
    if (this.placementMode == 'geodetic' && this.cesiumManager) {
      const target = this.geoManager.babylonPositionToGeodeticPosition(
        this.camera.target
      )
      this.cesiumManager.getTerrainHeightAsync(target).then((height) => {
        this.cameraTargetHeight = height
        setTimeout(this.updateCameraTargetTerrainHeight.bind(this), 1000)
      })
    }
  }

  private updateTerrainLoop() {
    if (this.placementMode != 'geodetic') {
      return
    }

    if (this.camera instanceof ArcRotateCamera) {
      const gridNumber = 40

      // Adjust to cover the range displayed in the camera
      const areaSize = this.camera.radius * 2

      const minimumInterval = 2
      const intervalSize = Math.max(minimumInterval, areaSize / gridNumber)

      // If the camera altitude is relatively high,
      // use a simplified terrain that does not take long to acquire data
      const useSimplifiedTerrain = this.camera.position.y > 10000
      this.terrainController
        ?.UpdateTerrainAsync(
          this.scene,
          this.camera.target,
          gridNumber,
          intervalSize,
          useSimplifiedTerrain
        )
        .then(() => {
          setTimeout(this.updateTerrainLoop.bind(this), 1000)
        })
    }
  }

  /**
   * invoked when a SpirareNode is clicked.
   */
  private onElementClicked(node: SpirareNode) {
    switch (this.runMode) {
      case 'viewer':
        node.invokeSpirareEvent('select')
        const link = node.element.webLink
        if (link) {
          window.open(link, '_blank')
        }
        break
      case 'editor':
        this.selectElement(node)
        break
    }
  }

  public selectElement(node: SpirareNode) {
    this.selectedNode = node

    this.gizmoController.attach(node)

    // Select the selected model in the inspector as well
    this.scene.debugLayer.select(node)

    // Highlight the selected model
    this.highlightLayer.removeAllMeshes()

    if (node.highlightable === false) {
      return
    }

    const meshes = node.getChildMeshes()
    meshes.forEach((mesh) => {
      if (mesh instanceof Mesh) {
        // Don't highlight point clouds because they turn black when highlighted
        if (mesh.material?.pointsCloud) {
          return
        }
        this.highlightLayer.addMesh(mesh, Color3.FromHexString('#FF6600'))
      }
    })
  }

  private selectElementInEditorMode(node: SpirareNode) {
    if (this.runMode == 'editor') {
      this.selectElement(node)
    }
  }

  /**
   * Deselects the selected model
   */
  private clearSelection() {
    this.selectedNode = undefined

    this.gizmoController.detach()

    this.scene.debugLayer.select(undefined)

    this.highlightLayer.removeAllMeshes()
  }

  public getCanvasSize(): { width: number; height: number } | undefined {
    const canvas = this.engine.getRenderingCanvas()
    if (canvas) {
      return {
        width: canvas.width,
        height: canvas.height,
      }
    }
    return undefined
  }

  public async buildPoml(): Promise<string> {
    const placements = this.getPlacementsForPoml()
    const poml = await this.pomlBuilder.buildPoml(
      this.scene,
      placements,
      this.sceneScriptElements
    )
    return poml
  }

  /**
   * Load a poml as the initial state of the scene
   * @param poml
   */
  public async initializeScene(poml: string): Promise<void> {
    await this.asyncLock.acquire(this.sceneLockKey, async () => {
      await this.restorePomlScene(poml)
    })
    await this.asyncLock.acquire(this.sceneLockKey, () => {
      this.historyManager.setInitialState(poml)
    })
  }

  /**
   * Override this method to upload added files
   * @param target
   * @returns success: boolean indicating whether the upload was successful, url: URL to be used for export
   */
  public async uploadFile(target: FileData): Promise<UploadFileResult> {
    // The default behavior is not to upload
    return { success: false }
  }

  /**
   * Override this method to get POML server url
   */
  public async getServerUrl(pomlId: string): Promise<ServerUrlResult> {
    return { success: false }
  }

  /**
   * Updates the recognition status of the Space in AR display mode
   */
  public updateSpaceStatus(status: SpaceStatus): void {
    console.log(status)

    findSpirareNodes(this.scene).forEach((n) => {
      n.updateSpaceStatus(status)
    })
  }

  public addDataAttribution(attribution: string[]): void {
    this.dataAttribution = [
      ...new Set([...this.dataAttribution, ...attribution]),
    ]

    this.updateDataAttributionText()
  }

  private updateDataAttributionText(): void {
    if (this.dataAttributionTextBlock) {
      this.dataAttributionTextBlock.text = this.dataAttribution.join('・')
    }
  }

  private listenFileDrop() {
    document.addEventListener('dragover', (event) => {
      event.stopPropagation()
      event.preventDefault()
    })
    document.addEventListener('dragleave', (event) => {
      event.stopPropagation()
      event.preventDefault()
    })
    document.addEventListener('drop', async (event) => {
      event.stopPropagation()
      event.preventDefault()
      const files = event.dataTransfer?.files
      this.loadFilesAsync(files)
    })
  }

  private async loadFilesAsync(files: FileList | null | undefined) {
    if (files === null || files === undefined) {
      return
    }

    const validFiles = Array.from(files).filter((file) => file.size > 0)
    const useCameraAdjustAnimation = validFiles.length === 1

    await Promise.all(
      validFiles.map((file) =>
        this.loadDroppedFileAsync(file, useCameraAdjustAnimation)
      )
    )
  }

  private async loadDroppedFileAsync(
    file: File,
    useCameraAdjustAnimation: boolean
  ): Promise<void> {
    const fileExt = file.name.split('.').pop()
    switch (fileExt) {
      case 'poml':
      case 'xml': {
        const text = await IOHelper.readFileTextAsync(file)
        await this.loadPomlAsync({ text })
        this.onEdit()
        console.log(`xml file loaded: '${file.name}'`)
        break
      }
      case 'zip': {
        // expected '.poml.zip'
        const poml = await this.loadPomlZipAsync(file)
        if (poml) {
          this.onEdit()
          console.log(`poml zip loaded: '${file.name}'`)
        }
        break
      }
      case 'b3dm': {
        const node = await B3dmLoader.loadAsync(file, this, this.scene)
        break
      }
      default: {
        const elementType = (() => {
          switch (fileExt) {
            case 'glb':
            case 'ifc':
            case 'ply':
            case 'splat': {
              return PomlModelElement
            }
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif': {
              return PomlImageElement
            }
            case 'mp4': {
              return PomlVideoElement
            }
          }
        })()
        if (elementType) {
          const uploadResult = await this.uploadFile({
            isLocalFile: false,
            data: await file.arrayBuffer(),
            name: file.name,
          })
          if (uploadResult.success) {
            const element = new elementType({
              src: uploadResult.src,
              filename: uploadResult.filename,
              position: CoordinateConverter.toSpirarePosition(
                this.camera.target.clone()
              ),
            })
            const node = await this.loadElementAsync(element)
            this.onEdit()
            await this.cameraController.adjust(node, useCameraAdjustAnimation)

            // If in editor mode, select the loaded SpirareNode
            this.selectElementInEditorMode(node)

            console.log(`file loaded: '${file.name}'`)
            break
          }
        }
        console.log(`Can not load unknown file: '${file.name}'`)
        break
      }
    }
  }

  private listenKeyDown() {
    this.scene.onKeyboardObservable.add((key) => {
      if (this.runMode !== 'editor') {
        return
      }

      // Use only key down events
      if (key.type != KeyboardEventTypes.KEYDOWN) {
        return
      }

      if (key.event instanceof KeyboardEvent == false) {
        return
      }
      const e = key.event as KeyboardEvent

      // Prevent browser shortcuts from triggering
      e.preventDefault()

      // Ignore repeated key presses
      if (e.repeat) {
        return
      }

      if (e.key == 'x') {
        this.gizmoController.switchGizmoCoordinate()
        this.updateGizmoModePanel()
      }

      if (e.key == 'q') {
        this.gizmoController.setGizmoMode('none')
        this.updateGizmoModePanel()
      }

      if (e.key == 'w') {
        this.gizmoController.setGizmoMode('position')
        this.updateGizmoModePanel()
      }

      if (e.key == 'e') {
        this.gizmoController.setGizmoMode('rotation')
        this.updateGizmoModePanel()
      }

      if (e.key == 'r') {
        this.gizmoController.setGizmoMode('scale')
        this.updateGizmoModePanel()
      }

      if (e.key == 'm') {
        this.cameraController.toggleCameraTargetMarker()
      }

      if (e.key == 'h') {
        if (this.hintUI) {
          this.hintUI.isVisible = !this.hintUI.isVisible
        }
      }

      // Ctrl + D
      if (e.ctrlKey && e.key == 'd') {
        this.cloneSelectedElementAsync()
      }

      // Ctrl + Z
      if (e.ctrlKey && e.key == 'z') {
        this.undoAsync()
      }

      // Ctrl + Y
      if (e.ctrlKey && e.key == 'y') {
        this.redoAsync()
      }

      // Esc: Clear selection of the model
      if (e.key == 'Escape') {
        this.clearSelection()
      }

      // Shift+Ctrl+Alt+I
      if (e.shiftKey && e.ctrlKey && e.altKey && e.keyCode === 73) {
        const debugLayer = this.scene.debugLayer
        if (debugLayer.isVisible()) {
          debugLayer.hide()
        } else {
          debugLayer.show({
            embedMode: true,
          })
        }
      }
    })
  }

  // Creates a viewer for world coordinate axes
  private createWorldAxesViewer() {
    new AxesViewer(this.scene, 0.4)
  }

  private createGroundGrid() {
    this.groundGridController = new GroundGridController()
    this.highlightLayer.addExcludedMesh(this.groundGridController.gridPlane)
  }

  private async undoAsync() {
    this.asyncLock.acquire(this.sceneLockKey, async () => {
      const poml = this.historyManager.undo()

      if (poml != undefined) {
        await this.restorePomlScene(poml)
        this.onChange?.()
      }
    })
  }

  private async redoAsync() {
    this.asyncLock.acquire(this.sceneLockKey, async () => {
      const poml = this.historyManager.redo()

      if (poml != undefined) {
        await this.restorePomlScene(poml)
        this.onChange?.()
      }
    })
  }

  private onEdit() {
    this.onChange?.()

    this.asyncLock.acquire(this.sceneLockKey, async () => {
      const poml = await this.buildPoml()
      this.historyManager.updateState(poml)
    })
  }

  /**
   * Sets the title of the scene
   * @param {string | undefined} title - The title to set.
   */
  private setTitle(title: string | undefined) {
    // Set the title without going through the property so that onEdit is not called.
    this._title = title
    const input = UIHelper.getControl(this.ui, 'titleInput', InputText)
    if (input !== undefined && input.text !== title) {
      input.text = title ?? ''
    }
  }

  /**
   * invoked when a spirarenode is loaded.
   * @param {SpirareNode} node - The loaded SpirareNode.
   * @memberof App
   */
  private onNodeLoaded(node: SpirareNode) {
    node.onChange = () => this.onEdit()
    node.onDispose = () => {
      if (this.gizmoController.attachedNode == node) {
        this.gizmoController.detach()
      }
      this.onEdit()
    }

    node.onClick = this.onElementClicked.bind(this)

    if (node.highlightable === false) {
      node.meshes.forEach((mesh) => {
        if (mesh instanceof Mesh) {
          this.highlightLayer.addExcludedMesh(mesh)
        }
      })
    }

    // If the geodetic placement mode is enabled, set the node's geoPlacement property to true for exporting geodetic coordinates.
    if (this.placementMode == 'geodetic') {
      node.geoPlacement = true
    }
  }

  private async loadPomlZipAsync(file: Blob): Promise<Poml | undefined> {
    const loaded = await this.pomlLoader.loadPomlZipAsync(file, this.scene)
    if (loaded) {
      this.sceneScriptElements = loaded.poml.scene.scriptElements
      loaded.nodes.forEach((node) => {
        if (node.type !== '?') {
          this.onNodeLoaded(node)
        }
      })
      return loaded.poml
    }
    return undefined
  }

  private async loadElementAsync<T extends MaybePomlElement>(
    element: T
  ): Promise<MaybeSpirareNode<T['type']>> {
    const loaded = await this.pomlLoader.loadPomlElementAsync(element, {
      scene: this.scene,
    })
    loaded.allNodes.forEach((node) => {
      if (node.type !== '?') {
        this.onNodeLoaded(node)
      }
    })
    return loaded.node
  }

  public async loadPomlAsync(
    pomlSource: { url: string } | { text: string },
    options?: LoadPomlOptions
  ): Promise<Poml> {
    const { poml, nodes } = await (async () => {
      if ('url' in pomlSource) {
        // Send geo location in HTTP header.
        const headers: Record<string, string> = {}
        if (this.isGeodeticMode) {
          const cameraTarget = this.camera.target
          const geodeticPosition =
            this.geoManager.babylonPositionToGeodeticPosition(cameraTarget)
          headers['Geolocation'] = [
            geodeticPosition.latitude,
            geodeticPosition.longitude,
            geodeticPosition.ellipsoidalHeight,
          ].join(',')
        }
        return await this.pomlLoader.loadPomlUrlAsync(
          this.scene,
          pomlSource.url,
          headers,
          options
        )
      } else {
        return await this.pomlLoader.loadPomlTextAsync(
          this.scene,
          pomlSource.text,
          options
        )
      }
    })()

    this.sceneScriptElements = poml.scene.scriptElements

    nodes.forEach((node) => {
      if (node.type !== '?') {
        this.onNodeLoaded(node)
      }
    })
    if (this.runMode === 'viewer') {
      await this.connectWebSocket(poml)
    }
    return poml
  }

  /**
   * Restores the scene with the specified Poml.
   * @private
   * @param {string} pomlString
   * @memberof App
   */
  private async restorePomlScene(pomlString: string) {
    this.clearScene()
    const poml = await this.loadPomlAsync({ text: pomlString })
    this.setTitle(poml.meta?.title)
  }

  private async cloneSelectedElementAsync(): Promise<void> {
    if (this.selectedNode === undefined) {
      return
    }

    const clonedElement = clone(this.selectedNode.element)
    const node = await this.loadElementAsync(clonedElement)
    this.selectElement(node)

    this.onEdit()
  }

  private async connectWebSocket(poml: Poml): Promise<void> {
    const wsRecvUrl = poml.scene.wsRecvUrl
    if (wsRecvUrl) {
      const comm = await WebSocketComm.Connect(this.scene, wsRecvUrl)
      this.scene.onDispose = () => {
        comm?.Disconnect()
      }
    }
  }

  /**
   * Clears the scene.
   * Note that this.onEdit() is not called within this function. Call onEdit() after clearing the scene.
   * @private
   * @memberof App
   */
  private clearScene() {
    this.clearSelection()
    findSpirareNodes(this.scene).forEach((n) => {
      // To avoid calling app.onEdit registered in onDispose, unregister the event beforehand.
      n.onDispose = () => {}

      n.dispose()
    })
  }

  private createUI(): Control {
    const isEditor = this.runMode === 'editor'
    const isViewer = this.runMode === 'viewer'

    const panelRows: Control[] = []
    const firstRow: Control[] = []
    if (this.startPageUrl) {
      firstRow.push(
        UIHelper.createImageButton(
          homeIcon,
          {
            background: '#3E8ED0',
            color: 'transparent',
            width: '30px',
            height: '30px',
            imagePadding: '3px',
          },
          () => {
            const a = document.createElement('a')
            a.href = this.startPageUrl ?? '/'
            a.click()
          }
        )
      )

      /*
      firstRow.push(
        UIHelper.createButton(
          'Go back',
          {
            width: '70px',
            height: '30px',
            background: '#3E8ED0',
            color: 'white',
          },
          () => {
            const a = document.createElement('a')
            a.href = this.startPageUrl ?? '/'
            a.click()
          }
        )
      )
      */
    }
    if (isEditor) {
      firstRow.push(
        UIHelper.createInputText(
          this._title === undefined ? '' : this._title,
          {
            width: '200px',
            height: '30px',
            placeholderText: 'title',
            name: 'titleInput',
          },
          {
            onBlur: (input, _) => {
              this.title = input.text
            },
          }
        )
      )
    }

    firstRow.push(
      UIHelper.createTextBlock(isEditor ? 'Editor Mode' : 'Viewer Mode', {
        paddingLeft: '6px',
        width: '120px',
        height: '30px',
      })
    )

    if (isEditor) {
      firstRow.push(
        UIHelper.createImageButton(
          shareIcon,
          {
            background: 'white',
            color: 'black',
            width: '30px',
            height: '30px',
            imagePadding: '3px',
          },
          async () => {
            const linkMenu = UIHelper.getControl(
              this.ui,
              'externalLinkMenu',
              Control
            ) as Control

            linkMenu.isVisible = !linkMenu.isVisible

            if (linkMenu.isVisible) {
              const serverUrlResult = await this.getServerUrl(this.pomlId)

              const urlText = UIHelper.getControl(
                this.ui,
                'urlText',
                TextBlock
              ) as TextBlock

              let serverUrlText = ''
              if (serverUrlResult.success) {
                serverUrlText = serverUrlResult.servers
                  .map((server) => {
                    return `- ${server.url}`
                  })
                  .join('\n')
              }

              urlText.text = serverUrlText

              const linkMenuNetwork = UIHelper.getControl(
                this.ui,
                'externalLinkMenuNetwork',
                Control
              ) as Control
              linkMenuNetwork.isVisible = serverUrlResult.success
            }
          }
        )
      )
    }

    panelRows.push(
      UIHelper.createStackPanel(
        {
          isVertical: false,
          width: '1000px',
          height: '30px',
        },
        firstRow
      )
    )

    if (this.isGeodeticMode) {
      panelRows.push(this.createGeoModeCameraTargetPanel())
    }

    if (isEditor) {
      if (this.isGeodeticMode) {
        panelRows.push(this.createModelListPanel())
      }
      panelRows.push(this.createNewNodePanel())
    }

    if (isEditor) {
      panelRows.push(this.createGizmoModePanel())
    }

    // Load poml from URL.
    // This feature is only enabled in Viewer mode.
    if (isViewer) {
      panelRows.push(
        UIHelper.createStackPanel(
          {
            isVertical: false,
            width: '1000px',
            height: '30px',
          },
          [
            UIHelper.createInputText('', {
              width: '460px',
              placeholderText: '<poml url>',
              name: 'pomlUrlInput',
            }),
            UIHelper.createButton('Load Poml', {}, async () => {
              const input = UIHelper.getControl(
                this.ui,
                'pomlUrlInput',
                InputText
              )
              if (input) {
                const url = input.text
                await this.loadPomlAsync({ url })
                this.onEdit()

                const currentUrl = window.location.href
                const pomlUrl = encodeURIComponent(url)
                const updateUrl = `${currentUrl}&poml-url=${pomlUrl}`
                window.history.replaceState(null, '', updateUrl)
              }
            }),
          ]
        )
      )
    }

    const leftStackPanel = UIHelper.createStackPanel(
      {
        width: '100%',
        height: '100%',
      },
      panelRows
    )

    const extenralLinkMenu = this.createExternalLinkMenu()

    const panel = UIHelper.createRectangle({
      width: '100%',
      height: '100%',
    })
    panel.addControl(leftStackPanel)
    panel.addControl(extenralLinkMenu)

    return panel
  }

  private createExternalLinkMenu(): Control {
    const rectanglePanel = UIHelper.createRectangle({
      name: 'externalLinkMenu',
      horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
      top: '30px',
      left: '176px',
      adaptHeightToChildren: true,
      adaptWidthToChildren: true,
      background: '#DDDDDD',
      color: 'black',
      cornerRadius: 8,
    })

    rectanglePanel.isVisible = false

    const horizontalStackPanel = UIHelper.createStackPanel({
      horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
      adaptHeightToChildren: true,
      adaptWidthToChildren: true,
      isVertical: false,
    })

    rectanglePanel.addControl(horizontalStackPanel)

    const verticalStackPanel = UIHelper.createStackPanel({
      width: '220px',
      horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
      adaptHeightToChildren: true,
    })

    const paddingLeft = UIHelper.createMargin({ width: '12px' })
    const paddingRight = UIHelper.createMargin({ width: '12px' })

    horizontalStackPanel.addControl(paddingLeft)
    horizontalStackPanel.addControl(verticalStackPanel)
    horizontalStackPanel.addControl(paddingRight)

    const paddingTop = UIHelper.createMargin({ height: '12px' })
    const paddingBottom = UIHelper.createMargin({ height: '12px' })

    const labelTextParam = {
      color: 'black',
      resizeToFit: true,
      fontSize: 14,
    }

    const fileLabelText = UIHelper.createTextBlock('File', labelTextParam)
    const fileLabelMargin = UIHelper.createMargin({ height: '4px' })

    const exportPomlButton = UIHelper.createButton(
      'Export POML',
      {
        left: '20px',
        width: '130px',
      },
      async () => await this.exportClicked()
    )

    exportPomlButton.onPointerEnterObservable.add(() => {
      exportPomlButton.background = '#EEEEEE'
    })

    exportPomlButton.onPointerOutObservable.add(() => {
      exportPomlButton.background = 'white'
    })

    const networkStackPanel = UIHelper.createStackPanel(
      {
        name: 'externalLinkMenuNetwork',
        horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
        verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
        width: '100%',
        adaptHeightToChildren: true,
      },
      [
        UIHelper.createMargin({ height: '12px' }),

        UIHelper.createTextBlock('Network', labelTextParam),
        UIHelper.createMargin({ height: '4px' }),

        UIHelper.createTextBlock(undefined, {
          name: 'urlText',
          width: '100%',
          left: '20px',
          color: 'black',
          resizeToFit: true,
        }),
      ]
    )

    verticalStackPanel.addControl(paddingTop)
    verticalStackPanel.addControl(fileLabelText)
    verticalStackPanel.addControl(fileLabelMargin)
    verticalStackPanel.addControl(exportPomlButton)

    verticalStackPanel.addControl(networkStackPanel)
    verticalStackPanel.addControl(paddingBottom)

    return rectanglePanel
  }

  private createGeoModeCameraTargetPanel(): Control {
    const cameraTargetInput = UIHelper.createInputText('', {
      width: '200px',
      height: '30px',
      placeholderText: 'latitude, longitude',
      name: 'cameraTargetInput',
    })

    const setCameraTargetButton = UIHelper.createButton(
      'Set Camera Target',
      { width: '150px' },
      () => {
        const token = cameraTargetInput.text.trim().split(/\s*,\s*|\s+/)
        const latitude = Number.parseFloat(token[0])
        const longitude = Number.parseFloat(token[1])
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          return
        }
        this.cameraController.setGeodeticCameraTarget(latitude, longitude)
      }
    )

    return UIHelper.createStackPanel(
      {
        isVertical: false,
        width: '1000px',
        height: '30px',
      },
      [cameraTargetInput, setCameraTargetButton]
    )
  }

  private createModelListPanel(): Control {
    return UIHelper.createStackPanel(
      {
        isVertical: true,
        width: `400px`,
        name: 'modelListPanel',
      },
      [
        UIHelper.createButton(
          'PLATEAU Models',
          { width: '150px' },
          async () => {
            const listViewer = UIHelper.getControl(
              this.ui,
              'modelList',
              ScrollViewer
            )
            if (listViewer) {
              listViewer.isVisible = !listViewer.isVisible
            }
            const grid = UIHelper.getControl(this.ui, 'modelGrid', Grid)
            if (grid && grid.children.length === 0) {
              const tilesets = Streaming3dTiles.getBuildingsNoTexture()
              const buttonHeightPix = 28
              tilesets.forEach((t, i) => {
                const button = UIHelper.createButton(
                  t.name,
                  {
                    width: '100%',
                    height: `${buttonHeightPix}px`,
                  },
                  async () => {
                    this.tilesLoader.loadAsync(t.url, t.name, this, this.scene)
                  }
                )
                grid.addRowDefinition(button.heightInPixels, true)
                grid.addControl(button, i)
              })
              grid.heightInPixels = tilesets.length * buttonHeightPix
            }
          }
        ),
        UIHelper.createScrollViewer(
          {
            name: 'modelList',
            height: '400px',
            isVisible: false,
          },
          [
            UIHelper.createGrid({
              name: 'modelGrid',
              background: 'gray',
            }),
          ]
        ),
      ]
    )
  }

  private updateGizmoModePanel() {
    this.gizmoModeButtons.forEach((button, buttonMode) => {
      if (buttonMode === this.gizmoController.gizmoMode) {
        button.background = '#778899'
      } else {
        button.background = 'gray'
      }
    })
  }

  private createGizmoModePanel() {
    const buttonParam = {
      width: '30px',
      height: '30px',
      imagePadding: '2px',
    }

    const buttonAction = (gizmoMode: GizmoMode): (() => void) => {
      return () => {
        this.gizmoController.setGizmoMode(gizmoMode)
        this.updateGizmoModePanel()
      }
    }

    const noneButton = UIHelper.createImageButton(
      gizmoNoneIcon,
      buttonParam,
      buttonAction('none')
    )

    const positionButton = UIHelper.createImageButton(
      gizmoPositionIcon,
      buttonParam,
      buttonAction('position')
    )

    const rotationButton = UIHelper.createImageButton(
      gizmoRotationIcon,
      buttonParam,
      buttonAction('rotation')
    )

    const scaleButton = UIHelper.createImageButton(
      gizmoScaleIcon,
      buttonParam,
      buttonAction('scale')
    )

    this.gizmoModeButtons.set('none', noneButton)
    this.gizmoModeButtons.set('position', positionButton)
    this.gizmoModeButtons.set('rotation', rotationButton)
    this.gizmoModeButtons.set('scale', scaleButton)

    this.updateGizmoModePanel()

    return UIHelper.createStackPanel(
      {
        isVertical: false,
        width: '400px',
        height: '30px',
        spacing: 1,
      },
      [noneButton, positionButton, rotationButton, scaleButton]
    )
  }

  private createNewNodePanel(): Control {
    const grid = UIHelper.createGrid({
      background: 'gray',
    })
    const buttonHeightPix = 28
    const buttonParam = {
      width: '100%',
      height: `${buttonHeightPix}px`,
    }
    const buttons = [
      UIHelper.createButton('Text', buttonParam, async () => {
        const element = new PomlTextElement({
          text: 'new text',
          position: CoordinateConverter.toSpirarePosition(
            this.camera.target.clone()
          ),
        })
        const textNode = await this.loadElementAsync(element)
        this.onEdit()
        await this.cameraController.adjust(textNode, true)
        this.selectElementInEditorMode(textNode)
      }),
      UIHelper.createButton('Local File...', buttonParam, async () => {
        const fileList = await openFilePicker({
          accept: '.poml,.zip,.jpg,.jpeg,.png,.gif,.mp4,.glb,.ply,.ifc',
          multiple: true,
        })
        await this.loadFilesAsync(fileList)
      }),
    ]
    buttons.forEach((b, i) => {
      grid.addRowDefinition(b.heightInPixels, true)
      grid.addControl(b, i)
    })
    grid.heightInPixels = buttons.length * buttonHeightPix

    const listViewer = UIHelper.createScrollViewer(
      {
        height: '200px',
        isVisible: false,
        background: 'gray',
      },
      [grid]
    )

    return UIHelper.createStackPanel(
      {
        isVertical: true,
        width: `200px`,
      },
      [
        UIHelper.createButton('Add new...', { width: '150px' }, async () => {
          listViewer.isVisible = !listViewer.isVisible
        }),
        listViewer,
      ]
    )
  }

  private getPlacementsForPoml(): CoordinateReference[] {
    return []
  }

  private async exportClicked(): Promise<void> {
    const placements = this.getPlacementsForPoml()

    const options: BuildOptions = {
      ignoreCustomAttributes: true,
    }

    const result = await this.pomlBuilder.buildPomlZip(
      this.scene,
      this.pomlId,
      placements,
      this.sceneScriptElements,
      options
    )

    if (result.pomlzBlob) {
      const zipName = this.title || this.pomlId
      IOHelper.downloadBlob(result.pomlzBlob, `${zipName}.poml.zip`)
    } else {
      IOHelper.downloadText(result.pomlText, `${this.pomlId}.poml`)
    }
    console.log(result.pomlText)
  }

  private createCesiumIonLogo(): Control {
    const logoUrl = `${CESIUM_BASE_URL}/Assets/Images/ion-credit.png`
    const logoWidth = 138
    const logoHeight = 28
    const logo = UIHelper.createImage(logoUrl, {
      width: `${logoWidth}px`,
      height: `${logoHeight}px`,
      paddingBottom: '6px',
      verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
    })
    return logo
  }

  // create data attribution ui
  private createCesiumJsDataAttributionUI(): Control {
    const buttonWidth = 130
    const paddingLeft = 140
    const button = UIHelper.createButton(
      'Data Attribution',
      {
        width: `${paddingLeft + buttonWidth}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingBottom: '4px',
        horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
        verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
      },
      async () => {
        const lightbox = document.getElementsByClassName(
          'cesium-credit-lightbox-overlay'
        )[0] as HTMLElement
        lightbox.style.display =
          lightbox.style.display === 'block' ? 'none' : 'block'
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }
    )
    return button
  }

  private createDataAttributionText(): TextBlock {
    const text = UIHelper.createTextBlock('', {
      paddingLeft: '280px',
      width: '100%',
      color: 'white',
      fontSize: '10px',
      lineSpacing: '-4px',
      textWrapping: true,
      horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
    })
    return text
  }

  private createHintUI(bottomOffset: number = 0): Control {
    const rectangle = UIHelper.createRectangle({
      background: '#202020',
      width: '400px',
      height: `${180 + bottomOffset}px`,
      color: '#32FF8E',
      paddingBottom: `${bottomOffset}px`,
      horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
    })

    const hintText = `   Q: View
   W: Move
   E: Rotation
   R: Scale
   X: Switch axis coord
   M: Toggle camera target marker
   H: Toggle hint`

    const text = UIHelper.createTextBlock(hintText, {
      fontSize: '20px',
      height: '180px',
      width: '400px',
      fontFamily: 'monospace, Courier',
    })
    rectangle.addControl(text)

    return rectangle
  }
}

export function getAppOrUndef(scene: Scene): App | undefined {
  const app: any = scene.metadata?.app
  if (app instanceof App) {
    return app
  }
  return undefined
}

export function getApp(scene: Scene): App {
  const app = getAppOrUndef(scene)
  if (app) {
    return app
  }
  throw new Error('Cannot get app from scene')
}
