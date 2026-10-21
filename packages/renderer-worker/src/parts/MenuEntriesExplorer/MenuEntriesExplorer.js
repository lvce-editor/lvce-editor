import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const id = MenuEntryId.Explorer

export const getMenuEntries = async (uid) => {
  const ownerUid = typeof uid === 'number' ? uid : Viewlet.getState('Explorer').uid
  const { applicationId, context, entries } = await ExplorerViewWorker.invoke('Explorer.getContextMenuData', ownerUid)
  const contributions =
    applicationId === undefined
      ? await ExtensionManagementWorker.invoke('Extensions.getExplorerContextMenuEntries', context)
      : await ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, 'Extensions.getExplorerContextMenuEntries', context)
  const extensionEntries = contributions.map((entry) =>
    applicationId === undefined
      ? entry
      : {
          ...entry,
          command: 'Application.execute',
          args: [applicationId, entry.command, ...(entry.args || [])],
        },
  )
  return [...entries, ...extensionEntries].map((entry) =>
    entry.command?.startsWith('Explorer.')
      ? { ...entry, command: 'Viewlet.executeViewletCommand', args: [ownerUid, entry.command.slice('Explorer.'.length), ...(entry.args || [])] }
      : entry,
  )
}
