import { expect, test } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletStatusBarMenuEntries from '../src/parts/ViewletStatusBar/ViewletStatusBarMenuEntries.js'

test('getMenus', async () => {
  const menus = await ViewletStatusBarMenuEntries.getMenus()

  expect(menus).toHaveLength(1)
  expect(menus[0].id).toBe(MenuEntryId.StatusBar)
})

test('getMenuEntries', async () => {
  const menus = await ViewletStatusBarMenuEntries.getMenus()
  const result = menus[0].getMenuEntries()

  expect(result).toEqual([
    {
      command: 'Layout.hideStatusBar',
      flags: MenuItemFlags.None,
      id: 'hide-status-bar',
      label: 'Hide Status Bar',
    },
  ])
})
