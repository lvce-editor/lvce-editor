import * as GetActivityBarItems from '../GetActivityBarItems/GetActivityBarItems.ts'
import * as GetFilteredActivityBarItems from '../GetFilteredActivityBarItems/GetFilteredActivityBarItems.ts'
import * as Height from '../Height/Height.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import type { ActivityBarState } from './ActivityBarState.ts'
import { focusIndex } from './ViewletActivityBarFocusIndex.js'

// TODO rename viewlet parameter to something else (e.g. clicking settings opens context menu not settings viewlet)
// TODO should just pass index
// then if item is viewlet -> open viewlet
// else if item is settings -> open settings

// TODO this should be create
// TODO unregister listeners when hidden

export const create = (id, uri, x, y, width, height): ActivityBarState => {
  return {
    uid: id,
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
    filteredItems: [],
    focusedIndex: -1,
    selectedIndex: -1,
    focused: false,
    x,
    y,
    width,
    height,
    itemHeight: Height.ActivityBarItem,
    commands: [],
  }
}

export const loadContent = async (state: ActivityBarState): Promise<ActivityBarState> => {
  const activityBarItems = GetActivityBarItems.getActivityBarItems()
  const sideBar = ViewletStates.getInstance(ViewletModuleId.SideBar)
  const viewletId = sideBar && sideBar.state ? sideBar.state.currentViewletId : ''
  const selectedIndex = findIndex(activityBarItems, viewletId)
  const filteredItems = GetFilteredActivityBarItems.getFilteredActivityBarItems(activityBarItems, state.height, state.itemHeight)
  return {
    ...state,
    selectedIndex,
    activityBarItems,
    filteredItems,
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

export const saveState = (state) => {
  return {}
}

export const focus = (state) => {
  const { focusedIndex } = state
  const indexToFocus = focusedIndex === -1 ? 0 : focusedIndex
  return focusIndex(state, indexToFocus)
}
