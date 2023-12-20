import * as I18nString from '../I18NString/I18NString.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NewFile: 'New File',
  NewWindow: 'New Window',
  OpenFile: 'Open File',
  OpenFolder: 'Open Folder',
  OpenRecent: 'Open Recent',
  Exit: 'Exit',
  Save: 'Save',
  SaveAll: 'Save All',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'newFile',
      label: I18nString.i18nString(UiStrings.NewFile),
      flags: MenuItemFlags.None,
      command: -1,
    },
    {
      id: 'newWindow',
      label: I18nString.i18nString(UiStrings.NewWindow),
      flags: MenuItemFlags.None,
      command: /* Window.openNew */ 'Window.openNew',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'openFile',
      label: I18nString.i18nString(UiStrings.OpenFile),
      flags: MenuItemFlags.None,
      command: 'Dialog.openFile',
    },
    {
      id: 'openFolder',
      label: I18nString.i18nString(UiStrings.OpenFolder),
      flags: MenuItemFlags.RestoreFocus,
      command: 'Dialog.openFolder',
    },
    {
      id: MenuEntryId.OpenRecent,
      label: I18nString.i18nString(UiStrings.OpenRecent),
      flags: MenuItemFlags.SubMenu,
      command: '',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'save',
      label: I18nString.i18nString(UiStrings.Save),
      flags: MenuItemFlags.None,
      command: 'Main.save',
    },
    {
      id: 'saveAll',
      label: I18nString.i18nString(UiStrings.SaveAll),
      flags: MenuItemFlags.None,
      command: 'Main.saveAll',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'exit',
      label: I18nString.i18nString(UiStrings.Exit),
      flags: MenuItemFlags.Ignore,
      command: 'Chrome.exit',
    },
  ]
}
