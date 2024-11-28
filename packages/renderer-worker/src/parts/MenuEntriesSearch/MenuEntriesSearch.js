import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const id = MenuEntryId.Search

export const getMenuEntries = () => {
  // TODO move this to search worker
  return [
    {
      id: 'dismiss',
      label: 'dismiss',
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'copyPath',
      label: 'copyPath',
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
