import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const handlePaste = async (state) => {
  return ExplorerViewWorker.invoke('Explorer.handlePaste', state)
}
