import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusIndex = (state, index) => {
  return ExplorerViewWorker.invoke('Explorer.focusIndex', state, index)
}
