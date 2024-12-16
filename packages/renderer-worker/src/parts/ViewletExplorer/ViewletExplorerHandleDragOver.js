import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handleDragOver = (state, x, y) => {
  return ExplorerViewWorker.invoke('Explorer.handleDragOver', state, x, y)
}
