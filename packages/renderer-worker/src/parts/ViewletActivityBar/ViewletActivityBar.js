import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as Command from '../Command/Command.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

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

export const name = 'ActivityBar'

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
    icon: 'icons/ellipsis.svg',
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
      id: 'Explorer',
      title: I18nString.i18nString(UiStrings.Explorer),
      icon: 'icons/files.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+E',
    },
    {
      id: 'Search',
      title: I18nString.i18nString(UiStrings.Search),
      icon: 'icons/search.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+F',
    },
    {
      id: 'Source Control',
      title: I18nString.i18nString(UiStrings.SourceControl),
      icon: 'icons/source-control.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+G',
    },
    {
      id: 'Run and Debug',
      title: I18nString.i18nString(UiStrings.RunAndDebug),
      icon: 'icons/debug-alt-2.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+D',
    },
    {
      id: 'Extensions',
      title: I18nString.i18nString(UiStrings.Extensions),
      icon: 'icons/extensions.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    // Bottom
    {
      id: 'Settings',
      title: I18nString.i18nString(UiStrings.Settings),
      icon: 'icons/settings-gear.svg',
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

export const contentLoaded = async (state) => {}

export const contentLoadedEffects = (state) => {
  // TODO
  GlobalEventBus.addListener(
    'SourceControl.changeBadgeCount',
    updateSourceControlCount
  )
  GlobalEventBus.addListener('Layout.hideSideBar', handleSideBarHidden)
  GlobalEventBus.addListener('SideBar.viewletChange', (id) =>
    handleSideBarViewletChange(state, id)
  )
}

export const dispose = () => {
  GlobalEventBus.removeListener(
    'SourceControl.changeBadgeCount',
    updateSourceControlCount
  )
  GlobalEventBus.removeListener('Layout.hideSideBar', handleSideBarHidden)
  GlobalEventBus.removeListener(
    'SideBar.viewletChange',
    handleSideBarViewletChange
  )
}

const findIndex = (activityBarItems, id) => {
  for (let i = 0; i < activityBarItems.length; i++) {
    if (activityBarItems[i].id === id) {
      return i
    }
  }
  return -1
}

export const handleSideBarViewletChange = async (state, id, ...args) => {
  const index = findIndex(state.activityBarItems, id)
  const oldIndex = state.selectedIndex
  state.selectedIndex = index
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'ActivityBar',
    /* method */ 'selectIndex',
    /* oldIndex */ oldIndex,
    /* newIndex */ index
  )
}

export const handleSideBarHidden = async (state) => {
  const oldIndex = state.focusedIndex
  state.focusedIndex = -1
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'ActivityBar',
    /* method */ 'selectIndex',
    /* oldIndex */ oldIndex,
    /* newIndex */ -1
  )
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
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'ActivityBar',
    /* method */ 'setBadgeCount',
    /* index */ index,
    /* count */ count
  )

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
  await RendererProcess.invoke(
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'ActivityBar',
    /* method */ 'setItems',
    /* items */ state.activityBarItems.filter(isEnabled),
    /* index */ state.selectedIndex
  )
}

export const handleContextMenu = async (state, x, y) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ 'activityBar'
  )
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export * from './ViewletActivityBarRender.js'
