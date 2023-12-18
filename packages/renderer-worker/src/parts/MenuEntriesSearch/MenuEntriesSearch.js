import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletSearchStrings from '../ViewletSearch/ViewletSearchStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'dismiss',
      label: ViewletSearchStrings.dismiss(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'copyPath',
      label: ViewletSearchStrings.copyPath(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
