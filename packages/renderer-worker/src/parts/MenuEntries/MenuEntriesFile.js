import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  NewFile: 'New File',
  NewWindow: 'New Window',
  Separator: 'Separator',
  OpenFile: 'Open File',
  OpenFolder: 'Open Folder',
  OpenRecent: 'Open Recent',
  Exit: 'Exit',
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
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: /* Separator */ 1,
      command: MenuItemFlags.None,
    },
    {
      id: 'openFile',
      label: I18nString.i18nString(UiStrings.OpenFile),
      flags: MenuItemFlags.None,
      command: 'Dialog.openFile',
    },
    {
      id: 'openFolder',
      label: I18nString.i18nString(UiStrings.OpenFolder),
      flags: MenuItemFlags.None,
      command: 'Dialog.openFolder',
    },
    {
      id: 'openRecent',
      label: I18nString.i18nString(UiStrings.OpenRecent),
      flags: MenuItemFlags.SubMenu,
      command: MenuItemFlags.None,
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: MenuItemFlags.Separator,
      command: MenuItemFlags.None,
    },
    {
      id: 'exit',
      label: I18nString.i18nString(UiStrings.Exit),
      flags: MenuItemFlags.None,
      command: /* Window.exit */ 'Window.exit',
    },
  ]
}
