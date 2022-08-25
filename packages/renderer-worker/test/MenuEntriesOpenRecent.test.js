import { jest } from '@jest/globals'
import * as MenuEntriesOpenRecent from '../src/parts/MenuEntries/MenuEntriesOpenRecent.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test.skip('getMenuEntries', async () => {
  // TODO jest unstable_mockModule doesn't seem to work anymore after upgrade from jest 27 to jest 28

  jest.unstable_mockModule(
    '../src/parts/RecentlyOpened/RecentlyOpened.js',
    () => {
      return {
        getRecentlyOpened() {
          return ['/workspace/folder-1', '/workspace/folder-2']
        },
      }
    }
  )
  const menuEntries = await MenuEntriesOpenRecent.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    label: '/workspace/folder-1',
  })
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    label: '/workspace/folder-2',
  })
})

test.skip('getMenuEntries - error with recently opened', async () => {
  jest.unstable_mockModule(
    '../src/parts/RecentlyOpened/RecentlyOpened.js',
    () => {
      return {
        getRecentlyOpened() {
          return ['/workspace/folder-1', '/workspace/folder-2']
        },
      }
    }
  )
  const menuEntries = await MenuEntriesOpenRecent.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    label: '/workspace/folder-1',
  })
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    label: '/workspace/folder-2',
  })
})
