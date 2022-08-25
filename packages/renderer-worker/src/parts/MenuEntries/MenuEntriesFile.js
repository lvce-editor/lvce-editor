import * as I18nString from '../I18NString/I18NString.js'

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
      flags: /* None */ 0,
      command: -1,
    },
    {
      id: 'newWindow',
      label: I18nString.i18nString(UiStrings.NewWindow),
      flags: /* None */ 0,
      command: /* Window.openNew */ 'Window.openNew',
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'openFile',
      label: I18nString.i18nString(UiStrings.OpenFile),
      flags: /* None */ 0,
      command: 'Dialog.openFile',
    },
    {
      id: 'openFolder',
      label: I18nString.i18nString(UiStrings.OpenFolder),
      flags: /* None */ 0,
      command: 'Dialog.openFolder',
    },
    {
      id: 'openRecent',
      label: I18nString.i18nString(UiStrings.OpenRecent),
      flags: /* SubMenu */ 4,
      command: /* None */ 0,
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'exit',
      label: I18nString.i18nString(UiStrings.Exit),
      flags: /* None */ 0,
      command: /* Window.exit */ 'Window.exit',
    },
  ]
}
