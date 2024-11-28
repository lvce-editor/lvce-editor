import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'

export const getKeyBindings = () => {
  return ExplorerViewWorker.invoke('Explorer.getKeyBindings')
}
