import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../src/parts/Icon/Icon.js'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.ipc.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

const ACTIVITY_BAR_ITEM_HEIGHT = 48

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
