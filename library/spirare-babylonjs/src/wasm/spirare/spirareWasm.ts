import { PomlElementStore } from '../../pomlElementStore'
import { getExportedFunction, getMemory } from '../utilities/webAssemblyHelper'
import { ErrorNo, ERROR_NO, numToEventType } from './spirareTypes'
import {
  change_anim,
  change_anim_by_name,
  get_anim_state,
  get_background_color,
  get_current_anim,
  get_display,
  get_id,
  get_id_len,
  get_position,
  get_rotation,
  get_scale,
  get_text,
  get_text_len,
  set_anim_state,
  set_background_color,
  set_display,
  set_position,
  set_rotation,
  set_scale,
  set_text,
} from './spirareWasmAttributeImpl'
import {
  get_all_elements,
  get_all_elements_len,
  get_element_by_id,
} from './spirareWasmElementsImpl'
import { getElementTypeNumber } from './spirareWasmUtils'

export class SpirareWasm {
  private instance?: WebAssembly.Instance
  private onEventCallbackFunction?: Function

  private readonly elementStore: PomlElementStore

  constructor(elementStore: PomlElementStore) {
    this.elementStore = elementStore
  }

  public setInstance(instance: WebAssembly.Instance) {
    this.instance = instance

    this.onEventCallbackFunction = getExportedFunction(
      instance,
      'on_event_callback'
    )
  }

  public getImports() {
    return {
      spirare_preview1: {
        get_all_elements: this.createWasmFunc(get_all_elements),
        get_all_elements_len: this.createWasmFunc(get_all_elements_len),
        get_element_by_id: this.createWasmFunc(get_element_by_id),

        register_event: this.register_event,

        get_id: this.createWasmFunc(get_id),
        get_id_len: this.createWasmFunc(get_id_len),

        get_display: this.createWasmFunc(get_display),
        set_display: this.createWasmFunc(set_display),

        get_position: this.createWasmFunc(get_position),
        set_position: this.createWasmFunc(set_position),
        get_rotation: this.createWasmFunc(get_rotation),
        set_rotation: this.createWasmFunc(set_rotation),
        get_scale: this.createWasmFunc(get_scale),
        set_scale: this.createWasmFunc(set_scale),

        get_text: this.createWasmFunc(get_text),
        get_text_len: this.createWasmFunc(get_text_len),
        set_text: this.createWasmFunc(set_text),

        get_background_color: this.createWasmFunc(get_background_color),
        set_background_color: this.createWasmFunc(set_background_color),

        change_anim: this.createWasmFunc(change_anim),
        change_anim_by_name: this.createWasmFunc(change_anim_by_name),
        get_anim_state: this.createWasmFunc(get_anim_state),
        set_anim_state: this.createWasmFunc(set_anim_state),
        get_current_anim: this.createWasmFunc(get_current_anim),
      },
    }
  }

  private getMemory(): ArrayBuffer | undefined {
    return getMemory(this.instance)
  }

  private execute(
    func: (memory: ArrayBuffer, elementStore: PomlElementStore) => ErrorNo
  ): ErrorNo {
    const memory = this.getMemory()
    if (memory === undefined) {
      return ERROR_NO.UnknownError
    }

    return func(memory, this.elementStore)
  }

  private createWasmFunc(
    func: (
      memory: ArrayBuffer,
      elementStore: PomlElementStore,
      ...args: number[]
    ) => ErrorNo
  ): (...args: number[]) => ErrorNo {
    return (...args: number[]) => {
      const memory = this.getMemory()
      if (memory === undefined) {
        return ERROR_NO.UnknownError
      }

      return func(memory, this.elementStore, ...args)
    }
  }

  private register_event = (
    elementDescriptor: number,
    eventTypeNum: number,
    callbackData: number
  ): ErrorNo => {
    return this.execute((memory, store) => {
      const node = store.GetNodeByElementDescriptor(elementDescriptor)
      if (node === undefined) {
        return ERROR_NO.ElementNotFound
      }

      const eventType = numToEventType(eventTypeNum)
      if (eventType === undefined) {
        return ERROR_NO.InvalidArgument
      }

      const assignedElementDescriptor =
        store.GetElementDescriptorBySpirareNode(node)
      if (assignedElementDescriptor === undefined) {
        return ERROR_NO.InvalidArgument
      }

      const elementTypeNum = getElementTypeNumber(node)

      node.registerEventCallback(eventType, () => {
        this.onEventCallbackFunction?.(
          assignedElementDescriptor,
          elementTypeNum,
          eventTypeNum,
          callbackData
        )
      })
      return ERROR_NO.Success
    })
  }
}
