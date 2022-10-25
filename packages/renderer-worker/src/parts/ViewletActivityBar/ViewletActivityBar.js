import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as Command from '../Command/Command.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as Icon from '../Icon/Icon.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { focusIndex } from './ViewletActivityBarFocusIndex.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Explorer: 'Explorer',
  Search: 'Search',
  SourceControl: 'Source Control',
  RunAndDebug: 'Run and Debug',
  Extensions: 'Extensions',
  Settings: 'Settings',
  AdditionalViews: 'Additional Views',
}

export const name = ViewletModuleId.ActivityBar

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
    title: I18nString.i18nString(UiStrings.AdditionalViews),
    icon: Icon.Ellipsis,
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = [
    ...items.slice(0, numberOfVisibleItems - 2),
    showMoreItem,
    items.at(-1),
  ]
  return visibleItems
}

export const create = (id, uri, left, top, width, height) => {
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
    left,
    top,
    width,
    height,
    itemHeight: 48,
  }
}

const getActivityBarItems = () => {
  return [
    // Top
    {
      id: ViewletModuleId.Explorer,
      title: I18nString.i18nString(UiStrings.Explorer),
      icon: Icon.Files,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+E',
    },
    {
      id: ViewletModuleId.Search,
      title: I18nString.i18nString(UiStrings.Search),
      icon: Icon.Search,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+F',
    },
    {
      id: ViewletModuleId.SourceControl,
      title: I18nString.i18nString(UiStrings.SourceControl),
      icon: Icon.SourceControl,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+G',
    },
    {
      id: ViewletModuleId.RunAndDebug,
      title: I18nString.i18nString(UiStrings.RunAndDebug),
      icon: Icon.DebugAlt2,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+D',
    },
    {
      id: ViewletModuleId.Extensions,
      title: I18nString.i18nString(UiStrings.Extensions),
      icon: Icon.Extensions,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    // Bottom
    {
      id: 'Settings',
      title: I18nString.i18nString(UiStrings.Settings),
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
  const viewletId =
    sideBar && sideBar.state ? sideBar.state.currentViewletId : ''
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
  const index = state.activityBarItems.findIndex(
    (item) => item.id === 'Source Control'
  )
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
  const activityBarItem = state.activityBarItems.find(
    (activityBarItem) => activityBarItem.id === item.label
  )
  activityBarItem.enabled = !activityBarItem.enabled
  return {
    ...state,
    items: state.activityBarItems.filter(isEnabled),
  }
}

export const handleContextMenu = async (state, x, y) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.ActivityBar
  )
  return state
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
    return (
      oldState.activityBarItems === newState.activityBarItems &&
      oldState.height === newState.height
    )
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleActivityBarItems(newState)
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setItems',
      /* items */ visibleItems,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return (
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.focused === newState.focused
    )
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
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
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setSelectedIndex',
      /* oldIndex */ oldState.selectedIndex,
      /* newIndex */ newState.selectedIndex,
    ]
  },
}

export const render = [
  renderActivityBarItems,
  renderFocusedIndex,
  renderSelectedIndex,
]

export const hasFunctionalRender = true
