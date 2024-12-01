import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const focusLast = (state) => {
  return ExplorerViewWorker.invoke('Explorer.focusLast', state)
}
