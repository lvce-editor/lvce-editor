import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const saveState = (state) => {
  return ExplorerViewWorker.invoke('Explorer.saveState', state.uid)
}
