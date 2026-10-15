import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const id = MenuEntryId.Explorer

export const getMenuEntries = async (uid) => {
  if (typeof uid === 'number') {
    const entries = await ExplorerViewWorker.invoke('Explorer.getMenuEntries2', uid)
    return entries.map((entry) =>
      entry.command?.startsWith('Explorer.')
        ? { ...entry, command: 'Viewlet.executeViewletCommand', args: [uid, entry.command.slice('Explorer.'.length), ...(entry.args || [])] }
        : entry,
    )
  }
  const explorerState = Viewlet.getState('Explorer')
  return ExplorerViewWorker.invoke('Explorer.getMenuEntries2', explorerState.uid)
}
