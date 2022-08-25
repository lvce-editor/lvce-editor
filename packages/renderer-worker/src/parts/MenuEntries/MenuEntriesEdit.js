import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  Undo: 'Undo',
  Redo: 'Redo',
  Separator: 'Separator',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  ToggleLineComment: 'Toggle Line Comment',
  ToggleBlockComment: 'Toggle Block Comment',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'undo',
      label: I18nString.i18nString(UiStrings.Undo),
      flags: MenuItemFlags.Disabled,
      command: /* TODO */ -1,
    },
    {
      id: 'redo',
      label: I18nString.i18nString(UiStrings.Redo),
      flags: MenuItemFlags.Disabled,
      command: /* TODO */ -1,
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: MenuItemFlags.Separator,
      command: /* TODO */ -1,
    },
    {
      id: 'cut',
      label: I18nString.i18nString(UiStrings.Cut),
      flags: MenuItemFlags.None,
      command: /* Editor.cut */ 'Editor.cut',
    },
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: /* Editor.copy */ 'Editor.copy',
    },
    {
      id: 'paste',
      label: I18nString.i18nString(UiStrings.Paste),
      flags: MenuItemFlags.None,
      command: /* Editor.paste */ 'Editor.paste',
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'toggle-line-comment',
      label: I18nString.i18nString(UiStrings.ToggleLineComment),
      flags: MenuItemFlags.None,
      command: /* Editor.toggleLineComment */ 'Editor.toggleLineComment',
    },
    {
      id: 'toggle-block-comment',
      label: I18nString.i18nString(UiStrings.ToggleBlockComment),
      flags: MenuItemFlags.None,
      command: /* Editor.toggleBlockComment */ 'Editor.toggleBlockComment',
    },
  ]
}
