import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const restoreState = (savedState) => {
  return ExplorerViewWorker.invoke('Explorer.restoreState', savedState)
}
