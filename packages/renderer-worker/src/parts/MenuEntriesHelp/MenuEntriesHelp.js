import * as HelpStrings from '../HelpStrings/HelpStrings.js'
import * as IsAutoUpdateSupported from '../IsAutoUpdateSupported/IsAutoUpdateSupported.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const getMenuEntries = async () => {
  const autoUpdateSupported = await IsAutoUpdateSupported.isAutoUpdateSupported()
  const entries = []
  entries.push(
    {
      id: 'toggleDeveloperTools',
      label: HelpStrings.toggleDeveloperTools(),
      flags: MenuItemFlags.None,
      command: 'Developer.toggleDeveloperTools',
    },
    {
      id: 'openProcessExplorer',
      label: HelpStrings.openProcessExplorer(),
      flags: MenuItemFlags.RestoreFocus,
      command: 'Developer.openProcessExplorer',
    },
  )
  if (autoUpdateSupported) {
    entries.push(
      MenuEntrySeparator.menuEntrySeparator,
      {
        id: 'checkForUpdates',
        label: HelpStrings.checkForUpdates(),
        flags: MenuItemFlags.RestoreFocus,
        command: 'AutoUpdater.checkForUpdates',
      },
      MenuEntrySeparator.menuEntrySeparator,
    )
  }
  entries.push({
    id: 'about',
    label: HelpStrings.about(),
    flags: MenuItemFlags.RestoreFocus,
    command: 'About.showAbout',
  })
  return entries
}
