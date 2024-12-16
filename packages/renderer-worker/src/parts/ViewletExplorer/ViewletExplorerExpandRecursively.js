import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const expandRecursively = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.expandRecursively', state)
}
