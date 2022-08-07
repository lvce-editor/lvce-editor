import * as ActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as MenuEntriesActivityBar from '../src/parts/MenuEntries/MenuEntriesActivityBar.js'

test.skip('getMenuEntries', async () => {
  ActivityBar.state.activityBarItems = [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Extensions',
      icon: './icons/extensions.svg',
      enabled: false,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
    },
  ]
  const menuEntries = await MenuEntriesActivityBar.getMenuEntries()
  expect(menuEntries).toContainEqual({
    id: 'moveSideBarLeft',
    label: 'Move Side Bar Left',
    flags: /* None */ 0,
    command: /* TODO */ -1,
  })
  expect(menuEntries).toContainEqual({
    flags: /* Checked */ 2,
    id: 8000,
    label: 'Explorer',
  })
  expect(menuEntries).toContainEqual({
    flags: /* Unchecked */ 3,
    id: 8000,
    label: 'Extensions',
  })
})
