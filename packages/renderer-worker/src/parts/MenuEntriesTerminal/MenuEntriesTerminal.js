import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const id = MenuEntryId.Terminal

export const getMenuEntries = () => {
  return [
    {
      id: 'newTerminal',
      label: TerminalStrings.newTerminal(),
      flags: MenuItemFlags.None,
      command: 'Layout.togglePanel',
      args: ['Terminal'],
    },
  ]
}
