import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletMainStrings from '../ViewletMain/ViewletMainStrings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const id = MenuEntryId.Main

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
    {
      id: 'splitRight',
      label: ViewletMainStrings.splitRight(),
      flags: MenuItemFlags.None,
      command: 'Main.splitRight',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'newWindow',
      label: ViewletMainStrings.newWindow(),
      flags: MenuItemFlags.None,
      command: 'Main.newWindow',
    },
  ]
}
