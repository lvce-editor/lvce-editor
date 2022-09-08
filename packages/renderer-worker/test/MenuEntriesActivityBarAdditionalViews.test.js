import * as Layout from '../src/parts/Layout/Layout.js'
import * as MenuEntriesActivityBarAdditionalViews from '../src/parts/MenuEntries/MenuEntriesActivityBarAdditionalViews.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

const ACTIVITY_BAR_ITEM_HEIGHT = 48

test.skip('getMenuEntries - all views fit', async () => {
  Layout.state.activityBarHeight = ACTIVITY_BAR_ITEM_HEIGHT * 6
  const menuEntries =
    await MenuEntriesActivityBarAdditionalViews.getMenuEntries()
  expect(menuEntries).toEqual([])
})

test.skip('getMenuEntries - two additional views', async () => {
  Layout.state.activityBarHeight = ACTIVITY_BAR_ITEM_HEIGHT * 5
  const menuEntries =
    await MenuEntriesActivityBarAdditionalViews.getMenuEntries()
  expect(menuEntries).toEqual([
    {
      command: -1,
      flags: MenuItemFlags.None,
      id: 8000,
      label: 'Run and Debug',
    },
    { command: -1, flags: MenuItemFlags.None, id: 8000, label: 'Extensions' },
  ])
})

test.skip('getMenuEntries - three additional views', async () => {
  Layout.state.activityBarHeight = ACTIVITY_BAR_ITEM_HEIGHT * 4
  const menuEntries =
    await MenuEntriesActivityBarAdditionalViews.getMenuEntries()
  expect(menuEntries).toEqual([
    {
      command: -1,
      flags: MenuItemFlags.None,
      id: 8000,
      label: 'Source Control',
    },
    {
      command: -1,
      flags: MenuItemFlags.None,
      id: 8000,
      label: 'Run and Debug',
    },
    {
      command: -1,
      flags: MenuItemFlags.None,
      id: 8000,
      label: 'Extensions',
    },
  ])
})
