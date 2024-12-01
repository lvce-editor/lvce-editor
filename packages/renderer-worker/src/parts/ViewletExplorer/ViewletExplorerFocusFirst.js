import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusFirst = (state) => {
  return ExplorerViewWorker.invoke('Explorer.focusFirst', state)
}
