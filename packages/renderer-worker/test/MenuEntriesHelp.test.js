import { jest } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IsAutoUpdateSupported/IsAutoUpdateSupported.js', () => {
  return {
    isAutoUpdateSupported: jest.fn(() => {
      return false
    }),
  }
})

const MenuEntriesHelp = await import('../src/parts/MenuEntriesHelp/MenuEntriesHelp.js')

test('getMenuEntries', async () => {
  const menuEntries = await MenuEntriesHelp.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'About.showAbout',
    flags: MenuItemFlags.RestoreFocus,
    id: 'about',
    label: 'About',
  })
})
