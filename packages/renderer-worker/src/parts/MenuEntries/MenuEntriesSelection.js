import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

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
      flags: MenuItemFlags.None,
      command: 'Editor.selectAll',
    },
    {
      id: 'copyLineUp',
      label: I18nString.i18nString(UiStrings.CopyLineUp),
      flags: MenuItemFlags.None,
      command: 'Editor.copyLineUp',
    },
    {
      id: 'copyLineDown',
      label: I18nString.i18nString(UiStrings.CopyLineDown),
      flags: MenuItemFlags.None,
      command: 'Editor.copyLineDown',
    },
    {
      id: 'moveLineUp',
      label: I18nString.i18nString(UiStrings.MoveLineUp),
      flags: MenuItemFlags.Disabled,
      command: 'Editor.moveLineUp',
    },
    {
      id: 'moveLineDown',
      label: I18nString.i18nString(UiStrings.MoveLineDown),
      flags: MenuItemFlags.Disabled,
      command: 'Editor.moveLineDown',
    },
  ]
}
