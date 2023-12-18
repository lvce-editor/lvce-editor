import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletMainStrings from '../ViewletMain/ViewletMainStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'openFile',
      label: ViewletMainStrings.openFile(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
