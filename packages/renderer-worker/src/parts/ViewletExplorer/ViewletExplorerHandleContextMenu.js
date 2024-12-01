import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handleContextMenu = (state, button, x, y) => {
  return ExplorerViewWorker.invoke('Explorer.handleContextMenu', state, button, x, y)
}
