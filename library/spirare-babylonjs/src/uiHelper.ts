import { EventState } from '@babylonjs/core'
import {
  Button,
  InputText,
  Checkbox,
  TextBlock,
  StackPanel,
  Control,
  Grid,
  ScrollViewer,
  Rectangle,
  AdvancedDynamicTexture,
} from '@babylonjs/gui'

type CallbackType<T> = (eventData: T, eventState: EventState) => void

export class UIHelper {
  public static createStackPanel(param?: object, children?: Array<Control>) {
    const defaultParam = {
      horizontalAlignment: StackPanel.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: StackPanel.VERTICAL_ALIGNMENT_TOP,
    }
    const panel = Object.assign(new StackPanel(), {
      ...defaultParam,
      ...param,
    })
    children?.forEach((c) => {
      panel.addControl(c)
    })
    return panel
  }

  public static createScrollViewer(param?: object, children?: Array<Control>) {
    const defaultParam = {
      horizontalAlignment: ScrollViewer.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: ScrollViewer.VERTICAL_ALIGNMENT_TOP,
      barSize: 15,
      barBackground: 'gray',
      barColor: '#E0E0E0',
    }
    const scroll = Object.assign(new ScrollViewer(), {
      ...defaultParam,
      ...param,
    })
    scroll.thumbLength = 0.3
    children?.forEach((c) => {
      scroll.addControl(c)
    })
    return scroll
  }

  public static createGrid(
    param?: object,
    rowDef?: ({ height: number; isPixel: boolean } | number)[],
    columnDef?: ({ width: number; isPixel: boolean } | number)[],
    children?: Array<{ control: Control; row: number; col: number }>
  ): Grid {
    const defaultParam = {
      horizontalAlignment: Grid.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Grid.VERTICAL_ALIGNMENT_TOP,
    }
    const grid = Object.assign(new Grid(), {
      ...defaultParam,
      ...param,
    })
    rowDef?.forEach((def) => {
      if (typeof def === 'number') {
        grid.addRowDefinition(def)
      } else {
        grid.addRowDefinition(def.height, def.isPixel)
      }
    })

    columnDef?.forEach((def) => {
      if (typeof def === 'number') {
        grid.addColumnDefinition(def)
      } else {
        grid.addColumnDefinition(def.width, def.isPixel)
      }
    })

    children?.forEach((c) => {
      grid.addControl(c.control, c.row, c.col)
    })
    return grid
  }

  public static createRectangle(param?: object, child?: Control) {
    const rectangle = new Rectangle(undefined)
    Object.assign(rectangle, {
      ...param,
    })
    if (child) {
      rectangle.addControl(child)
    }
    return rectangle
  }

  public static createTextBlock(text?: string, param?: object) {
    const defaultParam = {
      textHorizontalAlignment: TextBlock.HORIZONTAL_ALIGNMENT_LEFT,
      horizontalAlignment: TextBlock.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: TextBlock.VERTICAL_ALIGNMENT_TOP,
      color: 'white',
      width: '120px',
      height: '30px',
      fontSize: 14,
    }
    return Object.assign(new TextBlock(undefined, text), {
      ...defaultParam,
      ...param,
    })
  }

  public static createCheckbox(
    param?: object,
    isCheckedChanged?: (isChecked: boolean) => void
  ) {
    const defaultParam = {
      horizontalAlignment: Checkbox.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Checkbox.VERTICAL_ALIGNMENT_CENTER,
      checkSizeRatio: 0.4,
      background: 'white',
      width: '18px',
      height: '18px',
      color: 'black',
    }
    const checkbox = Object.assign(new Checkbox(), {
      ...defaultParam,
      ...param,
    })

    if (isCheckedChanged) {
      checkbox.onIsCheckedChangedObservable.add(isCheckedChanged)
    }
    return checkbox
  }

  public static createButton(
    text: string,
    param?: object,
    onPointerUp?: () => void
  ) {
    const defaultParam = {
      horizontalAlignment: Button.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Button.VERTICAL_ALIGNMENT_TOP,
      fontSize: 14,
      width: '100px',
      height: '28px',
      color: 'black',
      cornerRadius: '4',
      background: 'white',
    }
    const button = Object.assign(Button.CreateSimpleButton('', text), {
      ...defaultParam,
      ...param,
    })

    // Invoke onPointerUp only on left-click.
    button.onPointerUpObservable.add((event) => {
      if (event.buttonIndex == 0) {
        onPointerUp?.()
      }
    })
    return button
  }

  public static createImageButton(
    imageUrl: string,
    param?: object,
    onPointerUp?: () => void
  ) {
    const defaultParam = {
      horizontalAlignment: Button.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: Button.VERTICAL_ALIGNMENT_TOP,
      width: '28px',
      height: '28px',
      background: 'white',
    }
    const button = Object.assign(Button.CreateImageOnlyButton('', imageUrl), {
      ...defaultParam,
      ...param,
    })

    // Invoke onPointerUp only on left-click.
    button.onPointerUpObservable.add((event) => {
      if (event.buttonIndex == 0) {
        onPointerUp?.()
      }
    })
    return button
  }

  public static createInputText(
    text: string,
    param?: object,
    events?: {
      onTextChanged?: CallbackType<InputText>
      onBlur?: CallbackType<InputText>
    }
  ) {
    const defaultParam = {
      horizontalAlignment: InputText.HORIZONTAL_ALIGNMENT_LEFT,
      verticalAlignment: InputText.VERTICAL_ALIGNMENT_TOP,
      background: 'white',
      focusedBackground: 'white',
      color: 'black',
      fontSize: 14,
      width: '100px',
      height: '28px',
    }
    const inputText = Object.assign(new InputText(undefined, text), {
      ...defaultParam,
      ...param,
    })

    if (events?.onTextChanged) {
      inputText.onTextChangedObservable.add(events.onTextChanged)
    }
    if (events?.onBlur) {
      inputText.onBlurObservable.add(events.onBlur)
    }

    return inputText
  }

  public static getControl<T extends Control>(
    ui: AdvancedDynamicTexture | undefined,
    name: string,
    type: { new (): T }
  ): T | undefined {
    if (ui === undefined) {
      return undefined
    }
    const foundControls = this.getControls(ui, name)
    if (foundControls.length == 0) {
      return undefined
    }
    const control = foundControls[0]
    return control instanceof type ? control : undefined
  }

  public static getControls(
    ui: AdvancedDynamicTexture,
    name: string
  ): Control[] {
    return ui.getDescendants(false, (c) => c.name === name)
  }
}
