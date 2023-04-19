import { Scene } from '@babylonjs/core'
import { findSpirareNodeByIncludedId } from '../spirareNode/spirareNode'

export class WebSocketComm {
  private constructor(
    private readonly scene: Scene,
    private readonly webSocket: WebSocket
  ) {
    this.webSocket.onmessage = (e) => {
      if (typeof e.data === 'string') {
        this.readData(e.data)
      }
    }
  }

  private readData(text: string) {
    try {
      const obj = JSON.parse(text)
      if (obj instanceof Array) {
        const commands = obj as Array<any>
        commands.forEach((command) => {
          if (isCommand(command)) {
            this.setCommandValue(command)
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  private setCommandValue(command: Command) {
    const node = findSpirareNodeByIncludedId(this.scene, command.id)
    if (!node) {
      console.warn(`not found object, id: ${command.id}`)
      return
    }
    node.updateData(command)
  }

  /**
   * Create a new WebSocket and connect to the specified URL.
   *
   * @static
   * @param {Scene} scene
   * @param {string} url
   * @return {*}  {(Promise<WebSocketComm | undefined>)}
   * @memberof WebSocketComm
   */
  public static async Connect(
    scene: Scene,
    url: string
  ): Promise<WebSocketComm | undefined> {
    return await new Promise<WebSocketComm | undefined>((resolve) => {
      try {
        const ws = new WebSocket(url)
        ws.onopen = () => {
          resolve(new WebSocketComm(scene, ws))
        }
      } catch (error) {
        return undefined
      }
    })
  }

  public Disconnect(): void {
    const ws = this.webSocket
    ws.close()
  }
}

interface Command {
  id: string
}

const isCommand = (item: any): item is Command => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof item.id === 'string'
  )
}
