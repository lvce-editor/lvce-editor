import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  SelectAll: 'Select All',
  CopyLineUp: 'Copy Line Up',
  CopyLineDown: 'Copy Line Down',
  MoveLineUp: 'Move Line Up',
  MoveLineDown: 'Move Line Down',
  DuplicateSelection: 'Duplicate Selection',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'selectAll',
      label: I18nString.i18nString(UiStrings.SelectAll),
      flags: /* None */ 0,
      command: 'Editor.selectAll',
    },
    {
      id: 'copyLineUp',
      label: I18nString.i18nString(UiStrings.CopyLineUp),
      flags: /* None */ 0,
      command: 'Editor.copyLineUp',
    },
    {
      id: 'copyLineDown',
      label: I18nString.i18nString(UiStrings.CopyLineDown),
      flags: /* None */ 0,
      command: 'Editor.copyLineDown',
    },
    {
      id: 'moveLineUp',
      label: I18nString.i18nString(UiStrings.MoveLineUp),
      flags: /* Disabled */ 5,
      command: 'Editor.moveLineUp',
    },
    {
      id: 'moveLineDown',
      label: I18nString.i18nString(UiStrings.MoveLineDown),
      flags: /* Disabled */ 5,
      command: 'Editor.moveLineDown',
    },
  ]
}
