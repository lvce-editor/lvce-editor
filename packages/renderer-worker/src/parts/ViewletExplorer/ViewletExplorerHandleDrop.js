import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handleDrop = async (state, x, y, files) => {
  return ExplorerViewWorker.invoke('Explorer.handleDrop', state, x, y, files)
}
