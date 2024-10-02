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

  public keysForward = [87]
  public keysBackward = [83]
  public keysRight = [68]
  public keysLeft = [65]
  public keysUp = [81]
  public keysDown = [69]
  public keysSpeedUp = [16]

  get inputKeys(): number[] {
    return this.keysForward.concat(
      this.keysForward,
      this.keysBackward,
      this.keysRight,
      this.keysLeft,
      this.keysUp,
      this.keysDown,
      this.keysSpeedUp
    )
  }

  private rightClickButton = 2

  private onCanvasBlurObserver: Nullable<Observer<Engine>> = null
  private onKeyboardObserver: Nullable<Observer<KeyboardInfo>> = null
  private scene: Scene
  private engine: Engine

  private cameraControlEnabled = false
  private keys = new Array<number>()

  constructor(camera: ArcRotateCamera) {
    super()
    this.camera = camera
    this.scene = this.camera.getScene()
    this.engine = this.scene.getEngine()
  }

  public getSimpleName(): string {
    return 'wasdKeyboard'
  }

  public getClassName(): string {
    return 'KeyboardCameraPointersInput'
  }

  public attachControl(noPreventDefault?: boolean): void {
    super.attachControl(noPreventDefault)

    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments)

    if (this.onCanvasBlurObserver) {
      return
    }

    this.onCanvasBlurObserver = this.engine.onCanvasBlurObservable.add(() => {
      this.keys.length = 0
    })

    this.onKeyboardObserver = this.scene.onKeyboardObservable.add((info) => {
      const evt = info.event

      if (evt.metaKey) {
        return
      }

      const keyCode = evt.inputIndex
      if (this.inputKeys.indexOf(keyCode) === -1) {
        return
      }
      if (info.type === KeyboardEventTypes.KEYDOWN) {
        const index = this.keys.indexOf(keyCode)
        if (index === -1) {
          this.keys.push(keyCode)
        }
      } else if (info.type === KeyboardEventTypes.KEYUP) {
        const index = this.keys.indexOf(keyCode)
        if (index >= 0) {
          this.keys.splice(index, 1)
        }
      }

      if (evt.preventDefault) {
        if (!noPreventDefault) {
          evt.preventDefault()
        }
      }
    })
  }

  public detachControl(): void {
    if (this.scene) {
      if (this.onKeyboardObserver) {
        this.scene.onKeyboardObservable.remove(this.onKeyboardObserver)
      }
      if (this.onCanvasBlurObserver) {
        this.engine.onCanvasBlurObservable.remove(this.onCanvasBlurObserver)
      }
      this.onKeyboardObserver = null
      this.onCanvasBlurObserver = null
    }

    this.keys.length = 0
  }

  public checkInputs(): void {
    const camera = this.camera

    if (this.cameraControlEnabled === false) {
      return
    }

    if (this.keys.length === 0) {
      return
    }

    let horizontalMovementOnCameraPlane = new Vector3(0, 0, 0)
    let depthMovement = 0
    let speedUp = false

    for (let index = 0; index < this.keys.length; index++) {
      const keyCode = this.keys[index]
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
      } else if (this.keysSpeedUp.indexOf(keyCode) !== -1) {
        speedUp = true
      }
    }

    const speedUpScale = 2
    const speedFactor = speedUp ? speedUpScale : 1

    const depthSpeed = camera.radius * 0.01 * speedFactor
    const horizontalSpeed = camera.radius * 0.01 * speedFactor
    const minRadiusForZoomIn = 1

    let depthDelta = depthSpeed * depthMovement
    if (depthDelta > 0) {
      if (camera.radius - depthDelta >= minRadiusForZoomIn) {
        camera.radius -= depthDelta
        depthDelta = 0
      } else if (camera.radius > minRadiusForZoomIn) {
        camera.radius = minRadiusForZoomIn
        depthDelta -= camera.radius - minRadiusForZoomIn
      }
    } else {
      if (camera.radius <= minRadiusForZoomIn + 0.01) {
        // Move camera target when camera radius is small.
      } else {
        camera.radius -= depthDelta
        depthDelta = 0
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

  public onButtonUp(evt: IPointerEvent): void {
    if (evt.pointerType === 'mouse' && evt.button === this.rightClickButton) {
      this.cameraControlEnabled = false
    }
  }
}
