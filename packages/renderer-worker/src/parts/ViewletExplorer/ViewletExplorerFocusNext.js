import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusNext = (state) => {
  return ExplorerViewWorker.invoke('Explorer.focusNext', state)
}
