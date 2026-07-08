import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const menus = [
  {
    id: MenuEntryId.StatusBar,
    getMenuEntries() {
      return [
        {
          command: 'Layout.hideStatusBar',
          flags: MenuItemFlags.None,
          id: 'hide-status-bar',
          label: 'Hide Status Bar',
        },
      ]
    },
  },
]

export const getMenus = async () => {
  return menus
}
