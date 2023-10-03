import { PomlElement, PomlImageElement, PomlMediaElement } from 'ts-poml'
import { SpirareNodeBase } from './spirareNodeBase'
import { AssertTrue, IsNever, parseAsNumber } from './spirareNodeUtils'
import { InspectableType } from '@babylonjs/core'

export const mediaElementInspectables = [
  {
    label: 'Width',
    propertyName: 'width',
    type: InspectableType.String,
  },
  {
    label: 'Height',
    propertyName: 'height',
    type: InspectableType.String,
  },
  {
    label: 'Backface Mode',
    propertyName: 'backfaceMode',
    type: InspectableType.Options,
    options: [
      {
        label: 'none',
        value: 0,
      },
      {
        label: 'solid',
        value: 1,
      },
      {
        label: 'visible',
        value: 2,
      },
      {
        label: 'flipped',
        value: 3,
      },
    ],
  },
]

export class SpirareMediaNodeBase<
  T extends PomlElement<'image'> | PomlElement<'video'>
> extends SpirareNodeBase<T> {
  // Called from the inspector.
  private get width(): string | undefined {
    return this.element.width?.toString()
  }

  // Called from the inspector.
  private set width(value: string | undefined) {
    const num = parseAsNumber(value?.trim())
    if (this.element.width === num) {
      return
    }
    this.element.width = num
    if (num === undefined) {
      this.element.originalAttrs?.delete('width')
    }
    this.updateObject()
    this.onChange?.()
  }

  // Called from the inspector.
  private get height(): string | undefined {
    return this.element.height?.toString()
  }

  // Called from the inspector.
  private set height(value: string | undefined) {
    const num = parseAsNumber(value?.trim())
    if (this.element.height === num) {
      return
    }
    this.element.height = num
    if (num === undefined) {
      this.element.originalAttrs?.delete('height')
    }
    this.updateObject()
    this.onChange?.()
  }

  // Called from the inspector.
  private get backfaceMode(): number {
    const backfaceMode = this.element.backfaceMode
    console.log({ backfaceMode })
    switch (backfaceMode) {
      case undefined:
      case 'none': {
        return 0
      }
      case 'solid': {
        return 1
      }
      case 'visible': {
        return 2
      }
      case 'flipped': {
        return 3
      }
      default: {
        let _: AssertTrue<IsNever<typeof backfaceMode>>
        return 0
      }
    }
  }

  // Called from the inspector.
  private set backfaceMode(value: number) {
    const backfaceColorIsDefault = (
      colorString: string | undefined
    ): boolean => {
      if (colorString === undefined) {
        return true
      } else if (colorString === '#ffffff') {
        return true
      } else if (colorString === '#fff') {
        return true
      } else if (colorString === 'white') {
        return true
      }
      return false
    }

    const a = [undefined, 'solid', 'visible', 'flipped'] as const
    const newMode = a[value]
    if (this.element.backfaceMode !== newMode) {
      this.element.backfaceMode = newMode
      if (newMode === undefined) {
        this.element.originalAttrs?.delete('backface-mode')
      }

      // Delete backface-color attribute when backface-mode is not 'solid' and backface-color is default.
      if (
        newMode !== 'solid' &&
        backfaceColorIsDefault(this.element.backfaceColor)
      ) {
        this.element.backfaceColor = undefined
        this.element.originalAttrs?.delete('backface-color')
      }

      this.updateBackfaceColorInspector()
      this.updateObject()
      this.onChange?.()
    }
  }

  // Called from the inspector.
  private get backfaceColor(): string {
    return this.element.backfaceColor || '#ffffff'
  }

  private set backfaceColor(value: string) {
    if (value === this.backfaceColor) {
      return
    }

    this.element.backfaceColor = value
    this.updateObject()
    this.onChange?.()
  }

  protected updateObject() {}

  protected updateBackfaceColorInspector() {
    const backfaceColorLabel = 'Backface Color'
    const backfaceColorIndex = this.inspectableCustomProperties.findIndex(
      (x) => x.label === backfaceColorLabel
    )

    if (this.element.backfaceMode === 'solid') {
      const backfaceModeIndex = this.inspectableCustomProperties.findIndex(
        (x) => x.propertyName === 'backfaceMode'
      )

      if (backfaceModeIndex === -1) {
        return
      }

      if (backfaceColorIndex === -1) {
        this.inspectableCustomProperties.splice(backfaceModeIndex + 1, 0, {
          label: backfaceColorLabel,
          propertyName: 'backfaceColor',
          type: InspectableType.String,
        })
      }
    } else {
      if (backfaceColorIndex !== -1) {
        this.inspectableCustomProperties.splice(backfaceColorIndex, 1)
      }
    }
  }
}
