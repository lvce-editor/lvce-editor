import { jest } from '@jest/globals'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as Layout from '../src/parts/Layout/Layout.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ViewletActivityBar = await import(
  '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
)

const ACTIVITY_BAR_ITEM_HEIGHT = 48

test('name', () => {
  expect(ViewletActivityBar.name).toBe('ActivityBar')
})

test('loadContent', async () => {
  const state = ViewletActivityBar.create()
  ViewletStates.set('SideBar', {
    state: {
      currentViewletId: 'Search',
    },
  })
  expect(await ViewletActivityBar.loadContent(state)).toEqual({
    activityBarItems: [
      {
        enabled: true,
        flags: 1,
        icon: 'icons/files.svg',
        id: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/search.svg',
        id: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/source-control.svg',
        id: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/debug-alt-2.svg',
        id: 'Run and Debug',
        keyShortcuts: 'Control+Shift+D',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/extensions.svg',
        id: 'Extensions',
        keyShortcuts: 'Control+Shift+X',
      },
      {
        enabled: true,
        flags: 2,
        icon: 'icons/settings-gear.svg',
        id: 'Settings',
        keyShortcuts: '',
      },
    ],
    events: {
      'Layout.hideSideBar': 8014,
      'SideBar.viewletChange': 8013,
      'SourceControl.changeBadgeCount': 8012,
    },
    focusedIndex: -1,
    selectedIndex: 1,
  })
})

test('render - all items fit but little space is remaining', async () => {
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: 369,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }

  expect(ViewletActivityBar.render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: 1,
          icon: 'icons/files.svg',
          id: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/search.svg',
          id: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/source-control.svg',
          id: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/debug-alt-2.svg',
          id: 'Run and Debug',
          keyShortcuts: 'Control+Shift+D',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/extensions.svg',
          id: 'Extensions',
          keyShortcuts: 'Control+Shift+X',
        },
        {
          enabled: true,
          flags: 2,
          icon: 'icons/settings-gear.svg',
          id: 'Settings',
          keyShortcuts: '',
        },
      ],
    ],
  ])
})

test.skip('contentLoaded - one items does not fit', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletActivityBar.create(),
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }
  await ViewletActivityBar.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    'Viewlet.send',
    'ActivityBar',
    'setItems',
    [
      {
        enabled: true,
        flags: 1,
        icon: 'icons/files.svg',
        id: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/search.svg',
        id: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/source-control.svg',
        id: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: 2,
        icon: 'icons/ellipsis.svg',
        id: 'Additional Views',
        keyShortCuts: '',
      },
      {
        enabled: true,
        flags: 2,
        icon: 'icons/settings-gear.svg',
        id: 'Settings',
        keyShortcuts: '',
      },
    ],
    0,
  ])
})

test('render - two items do not fit', () => {
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 5,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }

  expect(ViewletActivityBar.render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: 1,
          icon: 'icons/files.svg',
          id: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/search.svg',
          id: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: 1,
          icon: 'icons/source-control.svg',
          id: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: 2,
          icon: 'icons/ellipsis.svg',
          id: 'Additional Views',
          keyShortCuts: '',
        },
        {
          enabled: true,
          flags: 2,
          icon: 'icons/settings-gear.svg',
          id: 'Settings',
          keyShortcuts: '',
        },
      ],
    ],
  ])
})

test.skip('handleContextMenu', async () => {
  RendererProcess.state.send = jest.fn()
  const state = ViewletActivityBar.create()
  await ViewletActivityBar.handleContextMenu(state, 0, 0)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3028,
    'ContextMenu',
    -260,
    -250,
    250,
    260,
    [
      {
        flags: 2,
        id: 8000,
        label: 'Explorer',
      },
      {
        flags: 2,
        id: 8000,
        label: 'Search',
      },
      {
        flags: 2,
        id: 8000,
        label: 'Source Control',
      },
      {
        flags: 2,
        id: 8000,
        label: 'Run and Debug',
      },
      {
        flags: 2,
        id: 8000,
        label: 'Extensions',
      },
      {
        flags: 2,
        id: 8000,
        label: 'Settings',
      },
      {
        flags: 1,
        id: 'separator',
        label: 'Separator',
      },
      {
        command: -1,
        flags: 0,
        id: 'moveSideBarLeft',
        label: 'Move Side Bar Left',
      },
      {
        command: 1107,
        flags: 0,
        id: 'hideActivityBar',
        label: 'Hide Activity Bar',
      },
    ],
  ])
})

test('focus', async () => {
  const state = ViewletActivityBar.create()
  expect(ViewletActivityBar.focus(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusNext', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 0,
  }
  expect(ViewletActivityBar.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusFirst', async () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 2,
  }
  expect(ViewletActivityBar.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 1,
  }
  expect(ViewletActivityBar.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('selectCurrent - settings', async () => {
  // TODO mock menu instead
  Layout.state.windowWidth = 1000
  Layout.state.windowHeight = 1000
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: 5,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 6 + 100,
    top: 20,
    left: 750,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletActivityBar.selectCurrent(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Menu.showMenu',
    750,
    408,
    250,
    132,
    [
      {
        command: 'Preferences.openSettingsJson',
        flags: 0,
        id: 'settings',
        label: 'Settings',
      },
      {
        command: -1,
        flags: 0,
        id: 'keyboardShortcuts',
        label: 'Keyboard Shortcuts',
      },
      {
        command: 'QuickPick.openColorTheme', // TODO have arg instead
        flags: 0,
        id: 'colorTheme',
        label: 'Color Theme',
      },
      {
        command: -1,
        flags: 0,
        id: 'checkForUpdates',
        label: 'Check For Updates',
      },
    ],
    0,
    -1,
    true
  )
})

test('selectCurrent - no item focused', async () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: -1,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 5,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletActivityBar.selectCurrent(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

// TODO test when height is too low to show any activity bar items, e.g. height=10px

test('resize', () => {
  const state = {
    ...ViewletActivityBar.create(),
    focusedIndex: -1,
    height: ACTIVITY_BAR_ITEM_HEIGHT * 8,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: /* Tab */ 1,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: /* Button */ 2,
        keyShortcuts: '',
      },
    ],
  }
  const { newState, commands } = ViewletActivityBar.resize(state, {
    top: 150,
    left: 150,
    width: 150,
    height: 150,
  })
  expect(newState).toEqual({
    activityBarItems: [
      {
        enabled: true,
        flags: 1,
        icon: 'icons/files.svg',
        id: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/search.svg',
        id: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/source-control.svg',
        id: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/debug-alt-2.svg',
        id: 'Run and Debug',
        keyShortcuts: 'Control+Shift+D',
      },
      {
        enabled: true,
        flags: 1,
        icon: 'icons/extensions.svg',
        id: 'Extensions',
        keyShortcuts: 'Control+Shift+X',
      },
      {
        enabled: true,
        flags: 2,
        icon: 'icons/settings-gear.svg',
        id: 'Settings',
        keyShortcuts: '',
      },
    ],
    events: {
      'Layout.hideSideBar': 8014,
      'SideBar.viewletChange': 8013,
      'SourceControl.changeBadgeCount': 8012,
    },
    focusedIndex: -1,
    height: 150,
    left: 150,
    selectedIndex: -1,
    top: 150,
    width: 150,
  })
  expect(commands).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: 1,
          icon: 'icons/files.svg',
          id: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: 2,
          icon: 'icons/ellipsis.svg',
          id: 'Additional Views',
          keyShortCuts: '',
        },
        {
          enabled: true,
          flags: 2,
          icon: 'icons/settings-gear.svg',
          id: 'Settings',
          keyShortcuts: '',
        },
      ],
      -1,
    ],
  ])
})
