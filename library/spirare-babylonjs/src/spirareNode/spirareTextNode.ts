import {
  DynamicTexture,
  Mesh,
  InspectableType,
  Vector3,
  Material,
  Scene,
  AbstractMesh,
} from '@babylonjs/core'
import { PomlElementBase, PomlTextElement } from 'ts-poml'
import { CreateNodeParams } from './spirareNode'
import { SpirareNodeBase } from './spirareNodeBase'
import {
  AssertTrue,
  createPlaneAndBackPlane,
  IsNever,
} from './spirareNodeUtils'

export class SpirareTextNode extends SpirareNodeBase<PomlTextElement> {
  private textTexture?: DynamicTexture
  private textMaterial?: Material
  private backMaterial?: Material
  private plane?: Mesh
  private backPlane?: Mesh

  private static default = {
    fontColor: 'white',
    backgroundColor: 'transparent',
    fontSize: { value: 1, unit: 'm' },
  } as const

  protected override get meshes(): (AbstractMesh | undefined)[] {
    return [this.plane, this.backPlane]
  }

  private constructor(
    pomlElement: PomlTextElement,
    params: CreateNodeParams,
    name?: string
  ) {
    super(pomlElement, params, name)

    if (this.app.runMode === 'editor') {
      this.inspectableCustomProperties.push(
        {
          label: '==== PomlTextElement ====',
          propertyName: '',
          type: InspectableType.Tab,
        },
        {
          label: 'Text',
          propertyName: 'text',
          type: InspectableType.String,
        },
        {
          label: 'FontSize',
          propertyName: 'fontSize',
          type: InspectableType.String,
        },
        {
          label: 'BackgroundColor',
          propertyName: 'backgroundColor',
          type: InspectableType.Color3,
        },
        {
          label: 'FontColor',
          propertyName: 'fontColor',
          type: InspectableType.Color3,
        }
      )
    }
    this.onDisposeObservable.add(() => this.cleanUp())
    this.updateText()
  }

  public static async create(
    pomlElement: PomlTextElement,
    params: CreateNodeParams,
    name?: string
  ): Promise<SpirareTextNode> {
    const node = new SpirareTextNode(pomlElement, params, name)
    return node
  }

  public get text(): string | undefined {
    return this.element.text
  }
  public set text(value: string | undefined) {
    if (value === this.text) {
      return
    }

    this.element.text = value
    this.updateText()
    this.onChange?.()
    //this.updateElementPartially({ text: value })
  }

  public get fontSize(): string | undefined {
    const parsed = SpirareTextNode.parseFontSize(this.element.fontSize)
    return `${parsed.value}${parsed.unit}`
  }
  public set fontSize(value: string | undefined) {
    const parsed = SpirareTextNode.parseFontSize(value)
    const fontSize = `${parsed.value}${parsed.unit}`
    if (fontSize === this.fontSize) {
      return
    }

    this.element.fontSize = fontSize
    this.updateText()
    this.onChange?.()
    // this.updateElementPartially({ fontSize: fontSize })
  }

  public get backgroundColor(): string {
    return (
      this.element.backgroundColor || SpirareTextNode.default.backgroundColor
    )
  }
  public set backgroundColor(value: string) {
    if (value === this.backgroundColor) {
      return
    }

    this.element.backgroundColor = value
    this.updateText()
    this.onChange?.()
    // this.updateElementPartially({ backgroundColor: value })
  }

  public get fontColor(): string {
    return this.element.fontColor || SpirareTextNode.default.fontColor
  }
  public set fontColor(value: string) {
    if (value === this.fontColor) {
      return
    }

    this.element.fontColor = value
    this.updateText()
    this.onChange?.()

    // this.updateElementPartially({ fontColor: value })
  }

  /*
  protected override updateElementPartially(diff: Partial<PomlTextElement>) {
    // super.updateElementPartially(diff)

    // --- For assertion ---
    //
    // A union of the properties (except 'type') defined by this class
    type TextProperties = keyof Omit<
      PomlTextElement,
      keyof PomlElementBase | 'type'
    >
    type CheckedTypes = (typeof properties)[number]
    type NotImpl = Exclude<TextProperties, CheckedTypes>
    type Unexpected = Exclude<CheckedTypes, TextProperties>

    // Causes a compilation error if there are any unimplemented properties
    let _: AssertTrue<IsNever<NotImpl>> & AssertTrue<IsNever<Unexpected>>
    // --------------------

    const properties = [
      'text',
      'fontSize',
      'fontColor',
      'backgroundColor',
    ] as const
    const keys: readonly string[] = properties
    const validKeys = Object.keys(diff).filter((key) => keys.includes(key))
    if (validKeys.length > 0) {
      this.updateText()
      this.onChange?.()
    }
  }
  */

  private updateText(): void {
    const created = SpirareTextNode.createText(this.getScene(), this.element)
    this.cleanUp()
    if (created) {
      this.plane = created.plane
      this.backPlane = created.backPlane
      this.textTexture = created.textTexture
      this.textMaterial = created.material
      this.backMaterial = created.backMaterial

      // Use the parent property instead of the setParent method.
      // setParent maintains the absolute position (the object does not move in relation to the entire scene).
      // Setting the parent property maintains the relative position.
      created.plane.parent = this
      created.backPlane.parent = this

      this.plane.actionManager = this.actionManager
      this.backPlane.actionManager = this.actionManager

      this.updateDisplay()
      this.updateLayerMask()
    }
  }

  private cleanUp() {
    this.plane?.dispose()
    this.backPlane?.dispose()
    this.textTexture?.dispose()
    this.textMaterial?.dispose()
    this.backMaterial?.dispose()

    this.plane = undefined
    this.backPlane = undefined
    this.textTexture = undefined
    this.textMaterial = undefined
    this.backMaterial = undefined
  }

  private static createText(scene: Scene, element: PomlTextElement) {
    const text = element.text
    if (text) {
      const fontSizeInMeter = this.getFontSizeInMeter(element.fontSize)

      // Font size used for rendering [px]
      // The actual size in space is adjusted by scale, so the font size used for rendering can be arbitrary.
      // Choose a number that is not too small to avoid making it look coarse.
      const renderedFontPx = 128 // px

      const font = `${renderedFontPx}px Arial`
      const texHeight = renderedFontPx * 1.5
      const texWidth = this.measureTextWidth(text, font)
      const aspect = texHeight / texWidth

      const texture = new DynamicTexture(
        'textTexture',
        {
          width: texWidth,
          height: texHeight,
        },
        scene
      )
      texture.drawText(
        text,
        null,
        null,
        font,
        element.fontColor || this.default.fontColor,
        element.backgroundColor || this.default.backgroundColor,
        true
      )

      const { plane, backPlane, ...materials } = createPlaneAndBackPlane(
        aspect,
        scene,
        texture,
        'text'
      )

      // The plane is designed to have a width of 1m.
      // Scale it to match the font size.
      const renderedFontSizeInMeter = renderedFontPx / texWidth // Size of the rendered text in meters
      const scale = fontSizeInMeter / renderedFontSizeInMeter
      plane.scaling = new Vector3(scale, scale, scale)
      backPlane.scaling = new Vector3(scale, scale, scale)

      return {
        plane: plane,
        backPlane: backPlane,
        textTexture: texture,
        ...materials,
      }
    }
  }

  private static parseFontSize(fontSize?: string): {
    value: number
    unit: 'm' | 'mm' | 'pt'
  } {
    type UnitType = 'm' | 'mm' | 'pt'
    const defaultFallback = this.default.fontSize
    if (fontSize === undefined) {
      return defaultFallback
    }
    try {
      const regex = /^(?<num>(\d|\.)+)(?<unit>m|mm|pt)$/
      const groups = fontSize.match(regex)?.groups
      if (!groups) {
        return defaultFallback
      }
      const num = Number.parseFloat(groups['num'])
      const unit = groups['unit']
      return {
        value: num,
        unit: unit as UnitType,
      }
    } catch {
      return defaultFallback
    }
  }

  private static getFontSizeInMeter(fontSize?: string): number {
    const { value, unit } = this.parseFontSize(fontSize)
    switch (unit) {
      case 'm': {
        return value
      }
      case 'mm': {
        return value * 0.001
      }
      case 'pt': {
        // 1pt == 0.35278mm
        return value * 0.35278 * 0.001
      }
      default: {
        let _: AssertTrue<IsNever<typeof unit>>
        throw new Error()
      }
    }
  }

  private static measureTextWidth(text: string, font: string): number {
    const dummyTex = new DynamicTexture('dummyTex', { width: 0, height: 0 })
    const context = dummyTex.getContext()
    context.font = font
    const texWidth = context.measureText(text).width
    dummyTex.dispose()
    return texWidth
  }
}
