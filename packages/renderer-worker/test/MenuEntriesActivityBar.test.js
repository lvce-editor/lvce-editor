import { expect, test } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as MenuEntriesActivityBar from '../src/parts/MenuEntriesActivityBar/MenuEntriesActivityBar.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'

test('getMenuEntries', async () => {
  const activityBarState = {
    activityBarItems: [
      {
        id: 'Explorer',
        icon: './icons/files.svg',
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
      },
      {
        id: 'Extensions',
        icon: './icons/extensions.svg',
        flags: ActivityBarItemFlags.Tab,
      },
      {
        id: 'Settings',
        icon: './icons/settings-gear.svg',
        flags: ActivityBarItemFlags.Button | ActivityBarItemFlags.Enabled,
      },
    ],
  }
  const layoutState = {
    sideBarLocation: SideBarLocationType.Right,
  }
  const menuEntries = await MenuEntriesActivityBar.getMenuEntries(layoutState, activityBarState)
  expect(menuEntries).toContainEqual({
    id: 'moveSideBarLeft',
    label: 'Move Side Bar Left',
    flags: MenuItemFlags.None,
    command: 'Layout.moveSideBarLeft',
  })
  expect(menuEntries).toContainEqual({
    flags: MenuItemFlags.Checked,
    id: 8000,
    label: 'Explorer',
  })
  expect(menuEntries).toContainEqual({
    flags: MenuItemFlags.Unchecked,
    id: 8000,
    label: 'Extensions',
  })
})

test('getMenuEntries - side bar is left', async () => {
  const activityBarState = {
    activityBarItems: [
      {
        id: 'Explorer',
        icon: './icons/files.svg',
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
      },
      {
        id: 'Extensions',
        icon: './icons/extensions.svg',
        flags: ActivityBarItemFlags.Tab,
      },
      {
        id: 'Settings',
        icon: './icons/settings-gear.svg',
        flags: ActivityBarItemFlags.Button | ActivityBarItemFlags.Enabled,
      },
    ],
  }
  const layoutState = {
    sideBarLocation: SideBarLocationType.Left,
  }
  const menuEntries = await MenuEntriesActivityBar.getMenuEntries(layoutState, activityBarState)
  expect(menuEntries).toContainEqual({
    id: 'moveSideBarRight',
    label: 'Move Side Bar Right',
    flags: MenuItemFlags.None,
    command: 'Layout.moveSideBarRight',
  })
  expect(menuEntries).toContainEqual({
    flags: MenuItemFlags.Checked,
    id: 8000,
    label: 'Explorer',
  })
  expect(menuEntries).toContainEqual({
    flags: MenuItemFlags.Unchecked,
    id: 8000,
    label: 'Extensions',
  })
})
