import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Height from '../Height/Height.js'
import * as Icon from '../Icon/Icon.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { focusIndex } from './ViewletActivityBarFocusIndex.js'
import * as ViewletActivityBarStrings from './ViewletActivityBarStrings.js'

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

export const create = (id, uri, x, y, width, height) => {
  return {
    // TODO declarative event api is good, but need to bind
    // listeners to state somehow
    // also the use of global event bus is not good
    // and this api is not strongly typed
    events: {
      'SourceControl.changeBadgeCount': 8012,
      'Layout.hideSideBar': 8014,
      'SideBar.viewletChange': 8013,
    },
    activityBarItems: [],
    focusedIndex: -1,
    selectedIndex: -1,
    focused: false,
    x,
    y,
    width,
    height,
    itemHeight: Height.ActivityBarItem,
  }
}

const getActivityBarItems = () => {
  return [
    // Top
    {
      id: ViewletModuleId.Explorer,
      title: ViewletActivityBarStrings.explorer(),
      icon: Icon.Files,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+E',
    },
    {
      id: ViewletModuleId.Search,
      title: ViewletActivityBarStrings.search(),
      icon: Icon.Search,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+F',
    },
    {
      id: ViewletModuleId.SourceControl,
      title: ViewletActivityBarStrings.sourceControl(),
      icon: Icon.SourceControl,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+G',
    },
    {
      id: ViewletModuleId.RunAndDebug,
      title: ViewletActivityBarStrings.runAndDebug(),
      icon: Icon.DebugAlt2,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+D',
    },
    {
      id: ViewletModuleId.Extensions,
      title: ViewletActivityBarStrings.extensions(),
      icon: Icon.Extensions,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    // Bottom
    {
      id: 'Settings',
      title: ViewletActivityBarStrings.settings(),
      icon: Icon.SettingsGear,
      enabled: true,
      flags: ActivityBarItemFlags.Button,
      keyShortcuts: '',
    },
  ]
}

export const loadContent = async (state) => {
  const activityBarItems = getActivityBarItems()
  const sideBar = ViewletStates.getInstance('SideBar')
  const viewletId = sideBar && sideBar.state ? sideBar.state.currentViewletId : ''
  const selectedIndex = findIndex(activityBarItems, viewletId)
  return {
    ...state,
    selectedIndex,
    activityBarItems,
  }
}

const findIndex = (activityBarItems, id) => {
  for (let i = 0; i < activityBarItems.length; i++) {
    if (activityBarItems[i].id === id) {
      return i
    }
  }
  return -1
}

export const handleSideBarViewletChange = (state, id, ...args) => {
  const index = findIndex(state.activityBarItems, id)
  return {
    ...state,
    selectedIndex: index,
  }
}

export const handleSideBarHidden = (state) => {
  return {
    ...state,
    focusedIndex: -1,
    selectedIndex: -1,
  }
}

export const updateSourceControlCount = async (state, count) => {
  if (count === 0) {
    return
  }
  const index = state.activityBarItems.findIndex((item) => item.id === 'Source Control')
  if (index === -1) {
    return
  }
  return {
    ...state,
    badgeCount: count,
  }

  // TODO send count to renderer process (if activity bar is visible)
}

export const toggleItem = (context, item) => {
  // const item = activityBarFindItem(id)
}

const isEnabled = (activityBarItem) => {
  return activityBarItem.enabled
}

export const toggleActivityBarItem = async (state, item) => {
  const activityBarItem = state.activityBarItems.find((activityBarItem) => activityBarItem.id === item.label)
  activityBarItem.enabled = !activityBarItem.enabled
  return {
    ...state,
    items: state.activityBarItems.filter(isEnabled),
  }
}

export const handleBlur = (state) => {
  return {
    ...state,
    focused: false,
  }
}

export const focus = (state) => {
  const { focusedIndex } = state
  const indexToFocus = focusedIndex === -1 ? 0 : focusedIndex
  return focusIndex(state, indexToFocus)
}
