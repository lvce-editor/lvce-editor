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

const getNumberOfVisibleItems = (state) => {
  const { height, itemHeight } = state
  const numberOfVisibleItemsTop = Math.floor(height / itemHeight)
  return numberOfVisibleItemsTop
}

export const getHiddenItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return []
  }
  return state.activityBarItems.slice(numberOfVisibleItems - 2, -1)
}

const getVisibleActivityBarItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return items
  }
  const showMoreItem = {
    id: 'Additional Views',
    title: ViewletActivityBarStrings.additionalViews(),
    icon: Icon.Ellipsis,
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = [...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)]
  return visibleItems
}

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

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

const renderActivityBarItems = {
  isEqual(oldState, newState) {
    return oldState.activityBarItems === newState.activityBarItems && oldState.height === newState.height
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleActivityBarItems(newState)
    return [/* method */ 'setItems', /* items */ visibleItems]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setFocusedIndex',
      /* unFocusIndex */ oldState.focusedIndex,
      /* focusIndex */ newState.focusedIndex,
      /* focused */ newState.focused,
    ]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [/* method */ 'setSelectedIndex', /* oldIndex */ oldState.selectedIndex, /* newIndex */ newState.selectedIndex]
  },
}

export const render = [renderActivityBarItems, renderFocusedIndex, renderSelectedIndex]

export const hasFunctionalRender = true
