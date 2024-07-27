import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.E2eTests

export const getMenuEntries = () => {
  return [
    {
      id: 'openInNewTab',
      label: 'Open in New Tab',
      flags: MenuItemFlags.None,
      command: 'E2eTests.openInNewTab',
    },
  ]
}
