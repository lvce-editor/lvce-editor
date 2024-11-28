import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusPrevious = (state) => {
  return ExplorerViewWorker.invoke('Explorer.focusPrevious', state)
}
