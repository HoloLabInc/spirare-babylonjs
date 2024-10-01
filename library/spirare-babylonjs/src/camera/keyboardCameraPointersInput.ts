import {
  ArcRotateCamera,
  BaseCameraPointersInput,
  Camera,
  Engine,
  FreeCamera,
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
  /*
    public camera: FreeCamera;
    public angularSensibility = 2000.0;

    // Touch-based variables
    public singleFingerRotate: boolean = false;
    public touchMoveSensibility: number = 250.0;
    public touchAngularSensibility: number = 200000.0;
    public touchEnabled: boolean = true;

    private _offsetX: BABYLON.Nullable<number> = null;
    private _offsetY: BABYLON.Nullable<number> = null;
    private _previousPositionX: BABYLON.Nullable<number> = null;
    private _previousPositionY: BABYLON.Nullable<number> = null;
    private _touches: number = 0;

        */
  private _onCanvasBlurObserver: Nullable<Observer<Engine>> = null
  private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> = null
  private _scene: Scene
  private _engine: Engine

  private cameraControlEnabled = false

  public keysForward = [87]
  public keysBackward = [83]
  public keysRight = [68]
  public keysLeft = [65]

  //public inputKeys
  // property
  get inputKeys(): number[] {
    return this.keysForward.concat(
      this.keysBackward,
      this.keysRight,
      this.keysLeft
    )
  }

  /**
   *
   */
  constructor(camera: ArcRotateCamera) {
    super()
    this.camera = camera
    this._scene = this.camera.getScene()
    this._engine = this._scene.getEngine()
  }

  public getSimpleName(): string {
    //return 'keyboard'
    return 'wasdKeyboard'
    //return 'pointers'
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

      /*
            if (!evt.metaKey) {
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    this._ctrlPressed = evt.ctrlKey;
                    this._altPressed = evt.altKey;

                    if (
                        this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1 ||
                        this.keysReset.indexOf(evt.keyCode) !== -1
                    ) {
                        const index = this._keys.indexOf(evt.keyCode);

                        if (index === -1) {
                            this._keys.push(evt.keyCode);
                        }

                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                } else {
                    if (
                        this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1 ||
                        this.keysReset.indexOf(evt.keyCode) !== -1
                    ) {
                        const index = this._keys.indexOf(evt.keyCode);

                        if (index >= 0) {
                            this._keys.splice(index, 1);
                        }

                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                }
            }
                */
    })
  }

  // We don't need to add the getSimpleName function as the base class
  // already provides a value of "pointers".  If you want it to be something
  // else though, feel free to implement it.

  // public getSimpleName(): string;

  // While normally, you'd also have to add an attachControl and detachControl function
  // when creating a custom input, this will already be handled by the base class.
  // You can also override them if you want but they do a lot of the heavy lifting so
  // be warned.

  // public attachControl(noPreventDefault?: boolean): void;
  // public detachControl(): void;

  /**
   * checkInputs
   *
   * It should be noted that this class is optional in general custom input development.
   * It will execute this function every frame.  We're using it here to update the camera
   * position/rotation in the same way as the touch class it's based off of.  If you don't
   * need to update something each frame, this function doesn't need to be overridden.
   */
  public checkInputs(): void {
    /*
        if (this.touchEnabled || this._offsetX === null || this._offsetY === null) {
            return;
        }
        if (this._offsetX === 0 && this._offsetY === 0) {
            return;
        }
            */

    // For most camera types (except for any based off of ArcRotateCamera), positions
    // and rotations are changed by modifying the cameraDirection and cameraRotation
    // vectors.
    const camera = this.camera

    if (this.cameraControlEnabled === false) {
      return
    }

    console.log('camera control enabled')

    if (this._keys.length === 0) {
      return
    }

    //let directionInLocal = new Vector3(0, 0, 0)
    // en: horizontal movement on the camera plane
    let horizontalMovementOnCameraPlane = new Vector3(0, 0, 0)
    let depthMovement = 0

    for (let index = 0; index < this._keys.length; index++) {
      const keyCode = this._keys[index]
      if (this.keysForward.indexOf(keyCode) !== -1) {
        depthMovement += 1
        //directionInLocal.addInPlace(new Vector3(0, 0, 1))
      } else if (this.keysBackward.indexOf(keyCode) !== -1) {
        //directionInLocal.addInPlace(new Vector3(0, 0, -1))
        depthMovement -= 1
      } else if (this.keysRight.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(1, 0, 0))
      } else if (this.keysLeft.indexOf(keyCode) !== -1) {
        horizontalMovementOnCameraPlane.addInPlace(new Vector3(-1, 0, 0))
      }
    }

    const minRadius = 0.5
    let depthDelta = camera.radius * 0.01 * depthMovement
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

    const direction = camera.getDirection(horizontalMovementOnCameraPlane)
    const speed = camera.radius * 0.01

    const horizontalDeltaVector = direction.scale(speed)
    const depthDeltaVector = camera.getDirection(new Vector3(0, 0, depthDelta))
    const deltaVector = horizontalDeltaVector.add(depthDeltaVector)
    const position = camera.position.add(deltaVector)
    const target = camera.target.add(deltaVector)
    camera.target = target
    camera.position = position

    //console.log(currentTarget)
    //console.log(newTarget)
    //camera.target = target
    //camera.setTarget(target)
    /*
        camera.cameraRotation.y = this._offsetX / this.touchAngularSensibility;

        const rotateCamera = (this.singleFingerRotate && this._touches === 1) || (!this.singleFingerRotate && this._touches > 1);

        if (rotateCamera) {
            camera.cameraRotation.x = -this._offsetY / this.touchAngularSensibility;
        } else {
            const speed = camera._computeLocalCameraSpeed();
            const direction = new BABYLON.Vector3(0, 0, this.touchMoveSensibility !== 0 ? (speed * this._offsetY) / this.touchMoveSensibility : 0);

            BABYLON.Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, camera._cameraRotationMatrix);
            camera.cameraDirection.addInPlace(BABYLON.Vector3.TransformCoordinates(direction, camera._cameraRotationMatrix));
        }
            */
  }

  /**
   * onTouch
   *
   * This function is required.  This will handle all logic related to a single touch.
   * This is called during a POINTERMOVE event.
   */
  /*
    public onTouch(point: BABYLON.Nullable<BABYLON.PointerTouch>, offsetX: number, offsetY: number): void {
        let directionAdjust = 1;
        if (this.camera.getScene().useRightHandedSystem) {
                directionAdjust *= -1;
        }
        if (this.camera.parent && this.camera.parent._getWorldMatrixDeterminant() < 0) {
            directionAdjust *= -1;
        }
        
        this.camera.cameraRotation.y += directionAdjust * offsetX / this.angularSensibility;
        
        // Since point holds the 'pointerType' from the firing event, we can access it here via 'type'
        // offsetX/Y will be clientX/Y - the previously stored point's x/y
        if (point.type === "mouse" || (point.type === "touch" && this.touchEnabled)) {
            this.camera.cameraRotation.x += offsetY / this.angularSensibility;
        }
        else if (this._previousPositionX === null || this._previousPositionY === null) {
            return;
        }
        else {
            this._offsetX = point.x - this._previousPositionX;
            this._offsetY = -(point.y - this._previousPositionY);
        }
    }
        */

  /**
   * onMultiTouch
   *
   * This function is required.  This will handle all logic when there are multiple active touches.
   * This is called during a POINTERMOVE event.
   *
   * pointA and B should never be null if this is called, unless you are manually calling this.
   *
   * The distances should also always have a value.
   *
   * The pan positions (which could be renamed as long as the data types are the same) may be
   * null at the beginning or the end of a movement.
   */
  /*
    public onMultiTouch(
        pointA: BABYLON.Nullable<BABYLON.PointerTouch>,
        pointB: BABYLON.Nullable<BABYLON.PointerTouch>,
        previousPinchSquaredDistance: number,
        pinchSquaredDistance: number,
        previousMultiTouchPanPosition: BABYLON.Nullable<BABYLON.PointerTouch>,
        multiTouchPanPosition: BABYLON.Nullable<BABYLON.PointerTouch>
    ): void {
        if (!this.touchEnabled && multiTouchPanPosition) {
            this._offsetX = multiTouchPanPosition.x - this._previousPositionX;
            this._offsetY = -(multiTouchPanPosition.y - this._previousPositionY);
        }
    }
        */

  /**
   * onButtonDown
   *
   * This function will trigger when a touch or button is pressed down.
   */
  public onButtonDown(evt: IPointerEvent): void {
    console.log('onbuttondown')
    console.log(evt)
    /*
    if (evt.pointerType === 'touch' && !this.touchEnabled) {
      this._previousPositionX = evt.clientX
      this._previousPositionY = evt.clientY
      this._touches++
    }
      */

    if (evt.pointerType === 'mouse' && evt.button === this.rightClickButton) {
      this.cameraControlEnabled = true
    }
  }

  rightClickButton = 2
  /**
   * onButtonUp
   *
   * This function will trigger when a touch or button is pressed up.
   */
  public onButtonUp(evt: IPointerEvent): void {
    console.log('onbuttonup')

    if (evt.pointerType === 'mouse' && evt.button === this.rightClickButton) {
      this.cameraControlEnabled = false
    }
    /*
    if (evt.pointerType === 'touch' && !this.touchEnabled) {
      this._previousPositionX = null
      this._previousPositionY = null
      this._offsetX = null
      this._offsetY = null
      this._touches -= this._touches > 0 ? 1 : 0
    }
      */
  }
}
