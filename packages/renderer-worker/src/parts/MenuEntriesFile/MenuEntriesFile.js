import * as FileStrings from '../FileStrings/FileStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const id = MenuEntryId.File

export const getMenuEntries = () => {
  const entries = [
    {
      id: 'newFile',
      label: FileStrings.newFile(),
      flags: MenuItemFlags.None,
      command: -1,
    },
    {
      id: 'newWindow',
      label: FileStrings.newWindow(),
      flags: MenuItemFlags.None,
      command: /* Window.openNew */ 'Window.openNew',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'openFile',
      label: FileStrings.openFile(),
      flags: MenuItemFlags.None,
      command: 'Dialog.openFile',
    },
    {
      id: 'openFolder',
      label: FileStrings.openFolder(),
      flags: MenuItemFlags.RestoreFocus,
      command: 'Dialog.openFolder',
    },
    {
      id: MenuEntryId.OpenRecent,
      label: FileStrings.openRecent(),
      flags: MenuItemFlags.SubMenu,
      command: '',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'save',
      label: FileStrings.save(),
      flags: MenuItemFlags.None,
      command: 'Main.save',
    },
    {
      id: 'saveAll',
      label: FileStrings.saveAll(),
      flags: MenuItemFlags.None,
      command: 'Main.saveAll',
    },
  ]
  if (Platform.getPlatform() === PlatformType.Electron) {
    entries.push(MenuEntrySeparator.menuEntrySeparator, {
      id: 'exit',
      label: FileStrings.exit(),
      flags: MenuItemFlags.Ignore,
      command: 'Chrome.exit',
    })
  }
  return entries
}
