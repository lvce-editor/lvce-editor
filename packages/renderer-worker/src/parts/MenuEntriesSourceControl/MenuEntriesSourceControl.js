import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  OpenChanges: 'Open Changes',
  OpenFile: 'Open File',
  OpenFileHead: 'Open File (HEAD)',
  DiscardChanges: 'Discard Changes',
  StageChanges: 'Stage Changes',
  AddToGitignore: 'Add to gitignore',
  RevealInExplorerView: 'Reveal in Explorer View',
  OpenContainingFolder: 'Open Containing Folder',
}

export const getMenuEntries = () => {
  return [
    {
      label: I18nString.i18nString(UiStrings.OpenChanges),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.OpenFile),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.OpenFileHead),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.DiscardChanges),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.StageChanges),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.AddToGitignore),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.RevealInExplorerView),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: I18nString.i18nString(UiStrings.OpenContainingFolder),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
