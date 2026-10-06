import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const id = MenuEntryId.TerminalTab

export const getMenuEntries = (uid, tabUid) => {
  const instance = ViewletStates.getByUid(uid)
  const tab = instance?.state.tabs.find((candidate) => candidate.uid === Number(tabUid))
  if (!tab) {
    return []
  }
  return [
    {
      id: 'terminalTabRename',
      label: TerminalStrings.renameTerminal(),
      flags: MenuItemFlags.None,
      command: 'Viewlet.executeViewletCommand',
      args: [uid, 'startRenameTerminal', tab.uid],
    },
  ]
}
