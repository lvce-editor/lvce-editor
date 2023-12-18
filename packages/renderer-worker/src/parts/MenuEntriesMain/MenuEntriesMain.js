import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletMainStrings from '../ViewletMain/ViewletMainStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'openFile',
      label: ViewletMainStrings.openFile(),
      flags: MenuItemFlags.None,
      command: 'Viewlet.openWidget',
      args: [ViewletModuleId.QuickPick, 'file'],
    },
  ]
}
