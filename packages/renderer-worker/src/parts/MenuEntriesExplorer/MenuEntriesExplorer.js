import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const id = MenuEntryId.Explorer

export const getMenuEntries = () => {
  const explorerState = Viewlet.getState('Explorer')
  return ExplorerViewWorker.invoke('Explorer.getMenuEntries2', explorerState.uid)
}
