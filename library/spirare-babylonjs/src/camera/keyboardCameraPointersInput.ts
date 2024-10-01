import {
  ArcRotateCamera,
  BaseCameraPointersInput,
  Engine,
  IPointerEvent,
  KeyboardEventTypes,
  KeyboardInfo,
  Nullable,
  Observer,
  Scene,
  Tools,
  Vector3,
} from '@babylonjs/core'

export class KeyboardCameraPointersInput extends BaseCameraPointersInput {
  public camera: ArcRotateCamera

  private _onCanvasBlurObserver: Nullable<Observer<Engine>> = null
  private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> = null
  private _scene: Scene
  private _engine: Engine

  private cameraControlEnabled = false

  public keysForward = [87]
  public keysBackward = [83]
  public keysRight = [68]
  public keysLeft = [65]
  public keysUp = [81]
  public keysDown = [69]

  get inputKeys(): number[] {
    return this.keysForward.concat(
      this.keysForward,
      this.keysBackward,
      this.keysRight,
      this.keysLeft,
      this.keysUp,
      this.keysDown
    )
  }

  constructor(camera: ArcRotateCamera) {
    super()
    this.camera = camera
    this._scene = this.camera.getScene()
    this._engine = this._scene.getEngine()
  }

  public getSimpleName(): string {
    return 'wasdKeyboard'
  }

  public getClassName(): string {
    return 'KeyboardCameraPointersInput'
  }

  private _keys = new Array<number>()

  public attachControl(noPreventDefault?: boolean): void {
    super.attachControl(noPreventDefault)

    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments)

    if (this._onCanvasBlurObserver) {
      return
    }

    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys.length = 0
    })

    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      const evt = info.event
      console.log(evt)

      if (evt.metaKey) {
        return
      }

      const keyCode = evt.keyCode
      if (this.inputKeys.indexOf(keyCode) === -1) {
        return
      }
      if (info.type === KeyboardEventTypes.KEYDOWN) {
        const index = this._keys.indexOf(keyCode)
        if (index === -1) {
          this._keys.push(keyCode)
        }
      } else if (info.type === KeyboardEventTypes.KEYUP) {
        const index = this._keys.indexOf(keyCode)
        if (index >= 0) {
          this._keys.splice(index, 1)
        }
      }

      if (evt.preventDefault) {
        if (!noPreventDefault) {
          evt.preventDefault()
        }
      }
    })
  }

  public checkInputs(): void {
    const camera = this.camera

    if (this.cameraControlEnabled === false) {
      return
    }

    if (this._keys.length === 0) {
      return
    }

    let horizontalMovementOnCameraPlane = new Vector3(0, 0, 0)
    let depthMovement = 0

    for (let index = 0; index < this._keys.length; index++) {
      const keyCode = this._keys[index]
      if (this.keysForward.indexOf(keyCode) !== -1) {
        depthMovement += 1
      } else if (this.keysBackward.indexOf(keyCode) !== -1) {
        depthMovement -= 1
      } else if (this.keysRight.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(1, 0, 0))
      } else if (this.keysLeft.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(-1, 0, 0))
      } else if (this.keysUp.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(0, 1, 0))
      } else if (this.keysDown.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(0, -1, 0))
      }
    }

    const depthSpeed = camera.radius * 0.01
    const horizontalSpeed = camera.radius * 0.01
    const minRadius = 1

    let depthDelta = depthSpeed * depthMovement
    if (depthDelta > 0) {
      if (camera.radius - depthDelta >= minRadius) {
        camera.radius -= depthDelta
        depthDelta = 0
      } else if (camera.radius > minRadius) {
        camera.radius = minRadius
        depthDelta -= camera.radius - minRadius
      }
    } else {
      if (camera.radius - depthDelta <= minRadius) {
        camera.radius -= depthDelta
        depthDelta = 0
      } else if (camera.radius < minRadius) {
        camera.radius = minRadius
        depthDelta += camera.radius - minRadius
      }
    }

    const depthDeltaVector = camera.getDirection(new Vector3(0, 0, depthDelta))

    const horizontalMovement = camera.getDirection(
      horizontalMovementOnCameraPlane
    )
    const horizontalDeltaVector = horizontalMovement.scale(horizontalSpeed)

    const deltaVector = horizontalDeltaVector.add(depthDeltaVector)
    camera.target = camera.target.add(deltaVector)
    camera.position = camera.position.add(deltaVector)
  }

  public onButtonDown(evt: IPointerEvent): void {
    if (evt.pointerType === 'mouse' && evt.button === this.rightClickButton) {
      this.cameraControlEnabled = true
    }
  }

  rightClickButton = 2

  public onButtonUp(evt: IPointerEvent): void {
    if (evt.pointerType === 'mouse' && evt.button === this.rightClickButton) {
      this.cameraControlEnabled = false
    }
  }
}
