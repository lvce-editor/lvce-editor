import * as ActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as MenuEntriesActivityBar from '../src/parts/MenuEntriesActivityBar/MenuEntriesActivityBar.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'

test.skip('getMenuEntries', async () => {
  ActivityBar.state.activityBarItems = [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
    },
    {
      id: 'Extensions',
      icon: './icons/extensions.svg',
      enabled: false,
      flags: ActivityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Button,
    },
  ]
  const menuEntries = await MenuEntriesActivityBar.getMenuEntries()
  expect(menuEntries).toContainEqual({
    id: 'moveSideBarLeft',
    label: 'Move Side Bar Left',
    flags: MenuItemFlags.None,
    command: /* TODO */ -1,
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
