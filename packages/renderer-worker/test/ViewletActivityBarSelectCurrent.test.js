import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

const ACTIVITY_BAR_ITEM_HEIGHT = 48

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => {
  return {
    show: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletActivityBar = await import('../src/parts/ViewletActivityBar/ViewletActivityBar.js')
const ViewletActivityBarSelectCurrent = await import('../src/parts/ViewletActivityBar/ViewletActivityBarSelectCurrent.js')
const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')

test('selectCurrent - settings', async () => {
  // TODO mock menu instead
  // Layout.state.windowWidth = 1000
  // Layout.state.windowHeight = 1000
  const state = {
    // @ts-ignore
    ...ViewletActivityBar.create(),
    focusedIndex: 5,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 6 + 100,
    y: 20,
    x: 750,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: 'Files',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: 'Search',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        title: 'Source Control',
        icon: 'SourceControl',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        title: 'Run and Debug',
        icon: 'DebugAlt2',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        title: 'Extensions',
        icon: 'Extensions',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: 'SettingsGear',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }
  // @ts-ignore
  ContextMenu.show.mockImplementation(() => {})
  expect(await ViewletActivityBarSelectCurrent.selectCurrent(state)).toBe(state)
  expect(ContextMenu.show).toHaveBeenCalledTimes(1)
  expect(ContextMenu.show).toHaveBeenCalledWith(750, 408, MenuEntryId.Settings)
})

test('selectCurrent - no item focused', async () => {
  const state = {
    // @ts-ignore
    ...ViewletActivityBar.create(),
    focusedIndex: -1,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 5,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: 'Files',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: 'Search',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        title: 'Source Control',
        icon: 'SourceControl',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        title: 'Run and Debug',
        icon: 'DebugAlt2',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        title: 'Extensions',
        icon: 'Extensions',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: 'SettingsGear',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }
  // @ts-ignore
  ContextMenu.show.mockImplementation(() => {})
  await ViewletActivityBarSelectCurrent.selectCurrent(state)
  expect(ContextMenu.show).not.toHaveBeenCalled()
})
