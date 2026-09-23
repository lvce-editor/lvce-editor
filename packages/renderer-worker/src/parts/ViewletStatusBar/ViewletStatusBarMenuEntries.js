import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @typedef {object} StatusBarContextMenuItem
 * @property {string} command
 * @property {string} id
 * @property {string} label
 * @property {readonly unknown[]} [args]
 */

export const menus = [
  {
    id: MenuEntryId.StatusBar,
    /**
     * @param {number} uid
     * @param {{ contextMenuItems?: readonly StatusBarContextMenuItem[] }} [props]
     */
    getMenuEntries(uid, { contextMenuItems = [] } = {}) {
      const contributedEntries = contextMenuItems.map((item) => ({
        ...item,
        flags: MenuItemFlags.None,
      }))
      return [
        ...contributedEntries,
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
