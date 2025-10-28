import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletActivityBar = await import('../src/parts/ViewletActivityBar/ViewletActivityBar.ipc.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletActivityBar, oldState, newState, ViewletModuleId.ActivityBar)
}

test.skip('loadContent', async () => {
  // @ts-ignore
  const state = ViewletActivityBar.create()
  ViewletStates.set('SideBar', {
    state: {
      currentViewletId: 'Search',
      title: 'Search',
    },
    renderedState: {
      currentViewletId: 'Search',
      title: 'Search',
    },
    factory: {},
  })
  expect(await ViewletActivityBar.loadContent(state)).toMatchObject({
    activityBarItems: [
      {
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
        icon: 'Files',
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
        icon: 'Search',
        id: ViewletModuleId.Search,
        title: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
        icon: 'SourceControl',
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
        icon: 'DebugAlt2',
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        keyShortcuts: 'Control+Shift+D',
      },
      {
        flags: ActivityBarItemFlags.Tab | ActivityBarItemFlags.Enabled,
        icon: 'Extensions',
        id: ViewletModuleId.Extensions,
        title: 'Extensions',
        keyShortcuts: 'Control+Shift+X',
      },
      {
        flags: ActivityBarItemFlags.Button | ActivityBarItemFlags.Enabled | ActivityBarItemFlags.MarginTop,
        icon: 'SettingsGear',
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

test.skip('render - all items fit but little space is remaining', async () => {
  // @ts-ignore
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: 369,
    activityBarItems: [
      // Top
      {
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: 'Files',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: 'Search',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: 'SourceControl',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: 'DebugAlt2',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
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

  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'Files',
          id: ViewletModuleId.Explorer,
          title: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'Search',
          id: ViewletModuleId.Search,
          title: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'SourceControl',
          id: ViewletModuleId.SourceControl,
          title: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'DebugAlt2',
          id: ViewletModuleId.RunAndDebug,
          title: 'Run and Debug',
          keyShortcuts: 'Control+Shift+D',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'Extensions',
          id: ViewletModuleId.Extensions,
          title: 'Extensions',
          keyShortcuts: 'Control+Shift+X',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: 'SettingsGear',
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
    // @ts-ignore
    ...ViewletActivityBar.create(),
    activityBarItems: [
      // Top
      {
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: 'Files',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: 'Search',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: 'SourceControl',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: 'DebugAlt2',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
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
        icon: 'Files',
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        keyShortcuts: 'Control+Shift+E',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: 'Search',
        id: ViewletModuleId.Search,
        title: 'Search',
        keyShortcuts: 'Control+Shift+F',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        icon: 'SourceControl',
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        keyShortcuts: 'Control+Shift+G',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: 'Ellipsis',
        id: 'Additional Views',
        title: 'Additional Views',
        keyShortCuts: '',
      },
      {
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        icon: 'SettingsGear',
        id: 'Settings',
        title: 'Settings',
        keyShortcuts: '',
      },
    ],
    0,
  ])
})

test.skip('render - two items do not fit', () => {
  // @ts-ignore
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: oldState.itemHeight * 5,
    activityBarItems: [
      // Top
      {
        id: ViewletModuleId.Explorer,
        title: 'Explorer',
        icon: 'Files',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: ViewletModuleId.Search,
        title: 'Search',
        icon: 'Search',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: ViewletModuleId.SourceControl,
        title: 'Source Control',
        icon: 'SourceControl',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: ViewletModuleId.RunAndDebug,
        title: 'Run and Debug',
        icon: 'DebugAlt2',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: ViewletModuleId.Extensions,
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

  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setItems',
      [
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'Files',
          id: ViewletModuleId.Explorer,
          title: 'Explorer',
          keyShortcuts: 'Control+Shift+E',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'Search',
          id: ViewletModuleId.Search,
          title: 'Search',
          keyShortcuts: 'Control+Shift+F',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Tab,
          icon: 'SourceControl',
          id: ViewletModuleId.SourceControl,
          title: 'Source Control',
          keyShortcuts: 'Control+Shift+G',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: 'Ellipsis',
          id: 'Additional Views',
          title: 'Additional Views',
          keyShortCuts: '',
        },
        {
          enabled: true,
          flags: ActivityBarItemFlags.Button,
          icon: 'SettingsGear',
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
  // @ts-ignore
  const state = ViewletActivityBar.create()
  // @ts-ignore
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
