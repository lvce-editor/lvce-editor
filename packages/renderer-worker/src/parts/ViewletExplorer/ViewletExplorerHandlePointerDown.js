import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handlePointerDown = (state, button, x, y) => {
  return ExplorerViewWorker.invoke('Explorer.handlePointerDown', state, x, y)
}
