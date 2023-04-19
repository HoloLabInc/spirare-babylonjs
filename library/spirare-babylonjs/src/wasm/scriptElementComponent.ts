import { ScriptElement } from 'ts-poml'
import { PomlElementStore } from '../pomlElementStore'
import { InvokableSpirareEventType } from '../types'
import { SpirareWasm } from './spirare/spirareWasm'
import { getExportedFunction } from './utilities/webAssemblyHelper'
import { Wasi } from './wasi/wasi'

export class ScriptElementComponent {
  private readonly scriptElement: ScriptElement
  private readonly elementStore: PomlElementStore

  private executableEntryPointFunction?: Function
  private onStartFunction?: Function
  private onUpdateFunction?: Function
  private onSelectFunction?: Function

  private initialized: boolean = false
  private onStartCalled: boolean = false

  constructor(scriptElement: ScriptElement, elementStore?: PomlElementStore) {
    this.scriptElement = scriptElement
    this.elementStore = elementStore ?? new PomlElementStore()
  }

  public async instantiateAsync() {
    let url = this.scriptElement.src
    if (!url) {
      return
    }

    const fetchResult = fetch(url)
    const module = await WebAssembly.compileStreaming(fetchResult)

    const env = new Map<string, string>()

    const wasi = new Wasi({
      env: env,
      args: [],
    })

    let wasiImports = wasi.getImports()

    const spirareWasm = new SpirareWasm(this.elementStore)
    const spirareImports = spirareWasm.getImports()

    const imports = { ...wasiImports, ...spirareImports }
    let instance = await WebAssembly.instantiate(module, imports)

    wasi.setInstance(instance)
    spirareWasm.setInstance(instance)

    this.executableEntryPointFunction = getExportedFunction(instance, '_start')
    this.onStartFunction = getExportedFunction(instance, 'on_start')
    this.onUpdateFunction = getExportedFunction(instance, 'on_update')
    this.onSelectFunction = getExportedFunction(instance, 'on_select')
    this.initialized = true
  }

  public invokeSpirareEvent(eventType: InvokableSpirareEventType) {
    if (this.initialized === false) {
      return
    }

    switch (eventType) {
      case 'update':
        this.invokeOnUpdate()
        break
      case 'select':
        this.invokeOnSelect()
        break
    }
  }

  private invokeOnUpdate() {
    if (this.onStartCalled === false) {
      this.executableEntryPointFunction?.()
      this.onStartFunction?.()
      this.onStartCalled = true
    }

    this.onUpdateFunction?.()
  }

  private invokeOnSelect() {
    if (this.onStartCalled === false) {
      return
    }

    this.onSelectFunction?.()
  }
}
