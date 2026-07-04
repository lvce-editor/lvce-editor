import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const id = MenuEntryId.ProcessExplorer

export const getMenuEntries = async () => {
  const processExplorerState = Viewlet.getState('ProcessExplorer')
  const r = await ProcessExplorerWorker.invoke('ProcessExplorer.getMenuEntries', processExplorerState.uid)
  return r
}
