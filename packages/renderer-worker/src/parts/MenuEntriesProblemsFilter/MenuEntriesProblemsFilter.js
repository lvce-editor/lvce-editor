import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.ProblemsFilter

export const getMenuEntries = () => {
  return [
    {
      id: 'show-errors',
      label: 'Show Errors',
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'show-warnings',
      label: 'Show Warnings',
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'show-infos',
      label: 'Show Infos',
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
