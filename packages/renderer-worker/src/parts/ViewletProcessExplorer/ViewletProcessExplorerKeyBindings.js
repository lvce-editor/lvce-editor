import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'

export const getKeyBindings = () => {
  return ProcessExplorerWorker.invoke('ProcessExplorer.getKeyBindings')
}
