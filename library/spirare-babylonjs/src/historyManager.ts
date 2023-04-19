export class HistoryManager {
  private undoHistory: string[] = []
  private redoHistory: string[] = []

  public setInitialState(state: string) {
    this.undoHistory = [state]
    this.redoHistory = []
  }

  public updateState(state: string) {
    this.undoHistory.push(state)
    this.redoHistory = []
  }

  public undo(): string | undefined {
    if (this.undoHistory.length == 1) {
      return undefined
    }

    const latestState = this.undoHistory.pop()
    if (latestState == undefined) {
      return undefined
    }

    // Add current state to redoHistory.
    this.redoHistory.push(latestState)

    return this.undoHistory[this.undoHistory.length - 1]
  }

  public redo(): string | undefined {
    const state = this.redoHistory.pop()
    if (state == undefined) {
      return undefined
    }

    this.undoHistory.push(state)
    return state
  }
}
