import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const id = MenuEntryId.ProcessExplorer

export const getMenuEntries = () => {
  const processExplorerState = Viewlet.getState('ProcessExplorer')
  return ProcessExplorerWorker.invoke('ProcessExplorer.getMenuEntries2', processExplorerState.uid)
}
