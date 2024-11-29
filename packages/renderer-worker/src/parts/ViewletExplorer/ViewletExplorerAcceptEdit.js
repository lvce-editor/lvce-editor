import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const acceptEdit = (state) => {
  return ExplorerViewWorker.invoke('Explorer.acceptEdit', state)
}
