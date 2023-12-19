import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletMainStrings from '../ViewletMain/ViewletMainStrings.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'openFile',
      label: ViewletMainStrings.openFile(),
      flags: MenuItemFlags.None,
      command: 'Viewlet.openWidget',
      args: [ViewletModuleId.QuickPick, 'file'],
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'splitUp',
      label: ViewletMainStrings.splitUp(),
      flags: MenuItemFlags.None,
      command: 'Main.splitUp',
    },
    {
      id: 'splitDown',
      label: ViewletMainStrings.splitDown(),
      flags: MenuItemFlags.None,
      command: 'Main.splitDown',
    },
    {
      id: 'splitLeft',
      label: ViewletMainStrings.splitLeft(),
      flags: MenuItemFlags.None,
      command: 'Main.splitLeft',
    },
  ]
}
