import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

// TODO add lots of tests for this
export const updateRoot = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.updateRoot', state)
}
