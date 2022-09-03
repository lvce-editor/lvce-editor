import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  About: 'About',
  ToggleDeveloperTools: 'Toggle Developer Tools',
  OpenProcessExplorer: 'Open Process Explorer',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'toggleDeveloperTools',
      label: I18nString.i18nString(UiStrings.ToggleDeveloperTools),
      flags: MenuItemFlags.None,
      command: 'Developer.toggleDeveloperTools',
    },
    {
      id: 'openProcessExplorer',
      label: I18nString.i18nString(UiStrings.OpenProcessExplorer),
      flags: MenuItemFlags.None,
      command: 'Developer.openProcessExplorer',
    },
    {
      id: 'about',
      label: I18nString.i18nString(UiStrings.About),
      flags: MenuItemFlags.None,
      command: 'Dialog.showAbout',
    },
  ]
}
