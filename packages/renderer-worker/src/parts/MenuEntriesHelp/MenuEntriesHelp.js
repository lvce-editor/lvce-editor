import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as IsAutoUpdateSupported from '../IsAutoUpdateSupported/IsAutoUpdateSupported.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  About: 'About',
  ToggleDeveloperTools: 'Toggle Developer Tools',
  OpenProcessExplorer: 'Open Process Explorer',
  CheckForUpdates: 'Check For Updates',
  Separator: '',
}

export const getMenuEntries = async () => {
  const autoUpdateSupported = await IsAutoUpdateSupported.isAutoUpdateSupported()
  console.log({ autoUpdateSupported })
  const entries = []
  entries.push(
    {
      id: 'toggleDeveloperTools',
      label: I18nString.i18nString(UiStrings.ToggleDeveloperTools),
      flags: MenuItemFlags.None,
      command: 'Developer.toggleDeveloperTools',
    },
    {
      id: 'openProcessExplorer',
      label: I18nString.i18nString(UiStrings.OpenProcessExplorer),
      flags: MenuItemFlags.RestoreFocus,
      command: 'Developer.openProcessExplorer',
    }
  )
  if (autoUpdateSupported) {
    entries.push(
      {
        id: 'separator',
        label: I18nString.i18nString(UiStrings.Separator),
        flags: MenuItemFlags.Separator,
        command: /* TODO */ -1,
      },
      {
        id: 'checkForUpdates',
        label: I18nString.i18nString(UiStrings.CheckForUpdates),
        flags: MenuItemFlags.RestoreFocus,
        command: 'AutoUpdater.checkForUpdates',
      },
      {
        id: 'separator',
        label: I18nString.i18nString(UiStrings.Separator),
        flags: MenuItemFlags.Separator,
        command: /* TODO */ -1,
      }
    )
  }
  entries.push({
    id: 'about',
    label: I18nString.i18nString(UiStrings.About),
    flags: MenuItemFlags.RestoreFocus,
    command: 'About.showAbout',
  })
  return entries
}
