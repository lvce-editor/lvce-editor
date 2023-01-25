import { jest } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as Icon from '../src/parts/Icon/Icon.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

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
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ViewletActivityBar = await import(
  '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const ACTIVITY_BAR_ITEM_HEIGHT = 48

const render = (oldState, newState) => {
  return ViewletManager.render(
    ViewletActivityBar,
    oldState,
    newState,
    ViewletModuleId.ActivityBar
  )
}

test('loadContent', async () => {
  const state = ViewletActivityBar.create()
  ViewletStates.set('SideBar', {
    state: {
      currentViewletId: 'Search',
      title: 'Search',
    },
    factory: {},
  })
  expect(await ViewletActivityBar.loadContent(state)).toMatchObject({
    activityBarItems: [
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Files,
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Search,
        id: ViewletModuleId.Search,
        title: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.SourceControl,
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.DebugAlt2,
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        keyShortcuts: 'Control+Shift+D',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Extensions,
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        keyShortcuts: 'Control+Shift+X',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: Icon.SettingsGear,
        id: 'Settings',
        title: 'Settings',
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
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: Icon.Files,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: Icon.Search,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: Icon.SourceControl,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: Icon.DebugAlt2,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        icon: Icon.Extensions,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: Icon.SettingsGear,
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }

  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.Files,
          id: ViewletModuleId.Explorer,
          title: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.Search,
          id: ViewletModuleId.Search,
          title: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.SourceControl,
          id: ViewletModuleId.SourceControl,
          title: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.DebugAlt2,
          id: ViewletModuleId.RunAndDebug,
          title: 'Run and Debug',
          keyShortcuts: 'Control+Shift+D',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.Extensions,
          id: ViewletModuleId.Extensions,
          title: 'Extensions',
          keyShortcuts: 'Control+Shift+X',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: Icon.SettingsGear,
          id: 'Settings',
          title: 'Settings',
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
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: Icon.Files,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: Icon.Search,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: Icon.SourceControl,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: Icon.DebugAlt2,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        icon: Icon.Extensions,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: Icon.SettingsGear,
        enabled: true,
        flags: ActivityBarItemFlags.Button,
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
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Files,
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Search,
        id: ViewletModuleId.Search,
        title: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.SourceControl,
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: Icon.Ellipsis,
        id: 'Additional Views',
        title: 'Additional Views',
        keyShortCuts: '',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: Icon.SettingsGear,
        id: 'Settings',
        title: 'Settings',
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
    height: oldState.itemHeight * 5,
    activityBarItems: [
      // Top
      {
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: Icon.Files,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: Icon.Search,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: Icon.SourceControl,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: Icon.DebugAlt2,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        icon: Icon.Extensions,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: Icon.SettingsGear,
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }

  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.Files,
          id: ViewletModuleId.Explorer,
          title: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.Search,
          id: ViewletModuleId.Search,
          title: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: Icon.SourceControl,
          id: ViewletModuleId.SourceControl,
          title: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: Icon.Ellipsis,
          id: 'Additional Views',
          title: 'Additional Views',
          keyShortCuts: '',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: Icon.SettingsGear,
          id: 'Settings',
          title: 'Settings',
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
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Explorer',
      },
      {
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Search',
      },
      {
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Source Control',
      },
      {
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Run and Debug',
      },
      {
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Extensions',
      },
      {
        flags: ActivityBarItemFlags.Button,
        id: 8000,
        title: 8000,
        label: 'Settings',
      },
      {
        flags: ActivityBarItemFlags.Tab,
        id: 'separator',
        title: 'separator',
        label: 'Separator',
      },
      {
        command: -1,
        flags: 0,
        id: 'moveSideBarLeft',
        title: 'moveSideBarLeft',
        label: 'Move Side Bar Left',
      },
      {
        command: 1107,
        flags: 0,
        id: 'hideActivityBar',
        title: 'hideActivityBar',
        label: 'Hide Activity Bar',
      },
    ],
  ])
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
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: Icon.Files,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: Icon.Search,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: Icon.SourceControl,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: Icon.DebugAlt2,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        icon: Icon.Extensions,
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: Icon.SettingsGear,
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }
  const newState = ViewletActivityBar.resize(state, {
    x: 150,
    y: 150,
    width: 150,
    height: 150,
  })
  expect(newState).toEqual({
    itemHeight: 48,
    activityBarItems: [
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Files,
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Search,
        id: ViewletModuleId.Search,
        title: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.SourceControl,
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.DebugAlt2,
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        keyShortcuts: 'Control+Shift+D',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: Icon.Extensions,
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        keyShortcuts: 'Control+Shift+X',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: Icon.SettingsGear,
        id: 'Settings',
        title: 'Settings',
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
    x: 150,
    selectedIndex: -1,
    y: 150,
    width: 150,
    focused: false,
  })
})
