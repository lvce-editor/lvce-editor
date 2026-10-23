import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetPathDirName from '../GetPathDirName/GetPathDirName.js'
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
  return [...entries, ...extensionEntries].map((entry) => {
    if (entry.command === 'Explorer.openInIntegratedTerminal') {
      // Opening the panel resizes Explorer. Dispatch after releasing its command queue.
      const cwd = context.isDirectory ? context.uri : GetPathDirName.getPathDirName(context.uri)
      return applicationId === undefined
        ? { ...entry, command: 'Layout.openIntegratedTerminal', args: [cwd] }
        : { ...entry, command: 'Application.execute', args: [applicationId, 'Layout.openIntegratedTerminal', cwd] }
    }
    return entry.command?.startsWith('Explorer.')
      ? { ...entry, command: 'Viewlet.executeViewletCommand', args: [ownerUid, entry.command.slice('Explorer.'.length), ...(entry.args || [])] }
      : entry
  })
}
