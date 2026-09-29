import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as SimpleBrowserStrings from '../SimpleBrowserStrings/SimpleBrowserStrings.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const id = MenuEntryId.SimpleBrowserTab

const getCommand = (uid, command, label, index, flags = MenuItemFlags.None) => ({
  id: `simpleBrowserTab${command}`,
  label,
  flags,
  command: 'Viewlet.executeViewletCommand',
  args: [uid, command, index],
})

export const getMenuEntries = (uid, index) => {
  const instance = ViewletStates.getByUid(uid)
  const state = instance?.state
  const tabIndex = Number(index)
  if (!state) {
    return []
  }
  const { tabs } = state
  if (tabIndex < 0 || tabIndex >= tabs.length) {
    return []
  }
  const tab = tabs[tabIndex]
  return [
    getCommand(uid, 'muteTab', tab.muted ? SimpleBrowserStrings.unmuteTab() : SimpleBrowserStrings.muteTab(), tabIndex),
    getCommand(uid, 'duplicateTab', SimpleBrowserStrings.duplicateTab(), tabIndex),
    getCommand(uid, 'reloadTab', SimpleBrowserStrings.reloadTab(), tabIndex),
    MenuEntrySeparator.menuEntrySeparator,
    getCommand(uid, 'closeTab', SimpleBrowserStrings.closeTab(), tabIndex),
    getCommand(
      uid,
      'closeTabsToTheLeft',
      SimpleBrowserStrings.closeTabsToTheLeft(),
      tabIndex,
      tabIndex === 0 ? MenuItemFlags.Disabled : MenuItemFlags.None,
    ),
    getCommand(
      uid,
      'closeTabsToTheRight',
      SimpleBrowserStrings.closeTabsToTheRight(),
      tabIndex,
      tabIndex === tabs.length - 1 ? MenuItemFlags.Disabled : MenuItemFlags.None,
    ),
    getCommand(
      uid,
      'closeOtherTabs',
      SimpleBrowserStrings.closeOtherTabs(),
      tabIndex,
      tabs.length === 1 ? MenuItemFlags.Disabled : MenuItemFlags.None,
    ),
  ]
}
