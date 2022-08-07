import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Layout from '../Layout/Layout.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const ACTIVITY_BAR_ITEM_HEIGHT = 48

export const name = 'ActivityBar'

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

const getNumberOfVisibleItems = (state) => {
  const numberOfVisibleItemsTop = Math.floor(
    state.height / ACTIVITY_BAR_ITEM_HEIGHT
  )
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
    icon: 'icons/ellipsis.svg',
    enabled: true,
    flags: /* Button */ 2,
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
  }
}

const getActivityBarItems = () => {
  return [
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
  ]
}

export const loadContent = async (state) => {
  const activityBarItems = getActivityBarItems()
  const sideBar = Viewlet.state.instances.SideBar
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

export const handleClick = async (state, index, x, y) => {
  const viewletId = state.activityBarItems[index].id
  switch (viewletId) {
    case 'Settings':
      console.log('is settings')
      await Command.execute(
        /* ContextMenu.show */ 'ContextMenu.show',
        /* x */ x,
        /* y */ y,
        /* id */ 'settings'
      )
      break
    case 'Additional Views':
      await Command.execute(
        /* ContextMenu.show */ 'ContextMenu.show',
        /* x */ x,
        /* y */ y,
        /* id */ 'activity-bar-additional-views'
      )
      break
    default:
      if (Layout.isSideBarVisible()) {
        await Command.execute(
          /* SideBar.showOrHideViewlet */ 'SideBar.showOrHideViewlet',
          /* id */ viewletId
        )
      } else {
        // TODO should show side bar with viewletId
        await Layout.showSideBar()
      }
      break
  }
  return state
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

export const focusIndex = (state, index) => {
  return {
    ...state,
    focusedIndex: index,
  }
}

export const focus = (state) => {
  const indexToFocus = state.focusedIndex === -1 ? 0 : state.focusedIndex
  return focusIndex(state, indexToFocus)
}

export const focusNext = (state) => {
  // TODO can never be -1 -> always set when sidebar changes
  if (state.focusedIndex === state.activityBarItems.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0) {
    return state
  }
  return focusIndex(state, state.focusedIndex - 1)
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  return focusIndex(state, state.activityBarItems.length - 1)
}

const getPosition = (state, index) => {
  if (index > state.activityBarItems.length - 2) {
    // at bottom
    return {
      x: state.left,
      y:
        state.top +
        state.height -
        (state.activityBarItems.length - 1 - index) * ACTIVITY_BAR_ITEM_HEIGHT,
    }
  }
  // at top
  return {
    x: state.left,
    y: state.top + index * ACTIVITY_BAR_ITEM_HEIGHT,
  }
}

export const selectCurrent = async (state) => {
  if (state.focusedIndex === -1) {
    return
  }
  const position = getPosition(state, state.focusedIndex)
  await handleClick(state, state.focusedIndex, position.x, position.y)
}

export const resize = (state, dimensions) => {
  const newState = {
    ...state,
    ...dimensions,
  }
  const visibleItems = getVisibleActivityBarItems(newState)
  const commands = [
    [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setItems',
      /* items */ visibleItems,
      /* selectedIndex */ newState.selectedIndex,
    ],
  ]
  return {
    newState,
    commands,
  }
}

export const render = (oldState, newState) => {
  const changes = []
  if (oldState === newState) {
    return changes
  }
  if (
    oldState.activityBarItems !== newState.activityBarItems ||
    oldState.height !== newState.height
  ) {
    const visibleItems = getVisibleActivityBarItems(newState)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setItems',
      /* items */ visibleItems,
    ])
  }
  if (oldState.focusedIndex !== newState.focusedIndex) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ActivityBar',
      /* method */ 'setFocusedIndex',
      /* unFocusIndex */ oldState.focusedIndex,
      /* focusIndex */ newState.focusedIndex,
    ])
  }
  return changes
}

export const hasFunctionalRender = true
