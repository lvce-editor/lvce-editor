import * as SimpleBrowser from './ViewletSimpleBrowser.js'

const getDraggedIndex = (state) => {
  const { draggedTab, tabs } = state
  if (!draggedTab) {
    return -1
  }
  // Unloaded tabs have no WebContentsView id; retain their object identity.
  return draggedTab.browserViewId ? tabs.findIndex((tab) => tab.browserViewId === draggedTab.browserViewId) : tabs.indexOf(draggedTab)
}

export const resetTabDrag = (state) => {
  const { draggedTab, isDraggingTab, tabDropIndex } = state
  if (!draggedTab && !isDraggingTab && tabDropIndex === -1) {
    return state
  }
  return { ...state, draggedTab: undefined, isDraggingTab: false, tabDropIndex: -1 }
}

export const handleTabPointerDown = async (state, index, button) => {
  const newState = await SimpleBrowser.hideTabHover(resetTabDrag(state))
  const tab = newState.tabs[Number(index)]
  if (button !== 0 || !tab) {
    return newState
  }
  return { ...newState, draggedTab: tab }
}

export const handleTabDragStart = (state) => {
  if (getDraggedIndex(state) === -1) {
    return resetTabDrag(state)
  }
  return { ...state, isDraggingTab: true }
}

export const handleTabDragOver = (state, index, offsetLeft, tabWidth, scrollLeft, clientX) => {
  const { isDraggingTab, tabs, x, tabDropIndex: oldTabDropIndex } = state
  const tabIndex = Number(index)
  if (!isDraggingTab || getDraggedIndex(state) === -1 || !Number.isInteger(tabIndex) || !tabs[tabIndex]) {
    return state
  }
  const midpoint = x + offsetLeft - scrollLeft + tabWidth / 2
  const tabDropIndex = clientX < midpoint ? tabIndex : tabIndex + 1
  return tabDropIndex === oldTabDropIndex ? state : { ...state, tabDropIndex }
}

export const handleTabsDragOver = (state) => {
  const { isDraggingTab, tabDropIndex, tabs } = state
  if (!isDraggingTab || getDraggedIndex(state) === -1) {
    return state
  }
  return tabDropIndex === tabs.length ? state : { ...state, tabDropIndex: tabs.length }
}

export const handleTabDragLeave = (state, clientX, clientY) => {
  const { x, y, width, tabDropIndex } = state
  if (clientX >= x && clientX < x + width && clientY >= y && clientY < y + 35) {
    return state
  }
  return tabDropIndex === -1 ? state : { ...state, tabDropIndex: -1 }
}

export const handleTabDrop = (state) => {
  const sourceIndex = getDraggedIndex(state)
  const { isDraggingTab, tabDropIndex, tabs, selectedTabIndex } = state
  const newState = resetTabDrag(state)
  if (!isDraggingTab || sourceIndex === -1 || !Number.isInteger(tabDropIndex) || tabDropIndex < 0 || tabDropIndex > tabs.length) {
    return newState
  }
  const targetIndex = tabDropIndex > sourceIndex ? tabDropIndex - 1 : tabDropIndex
  if (sourceIndex === targetIndex) {
    return newState
  }
  const selectedTab = tabs[selectedTabIndex]
  const reorderedTabs = [...tabs]
  const [tab] = reorderedTabs.splice(sourceIndex, 1)
  reorderedTabs.splice(targetIndex, 0, tab)
  return { ...newState, tabs: reorderedTabs, selectedTabIndex: reorderedTabs.indexOf(selectedTab) }
}

export const renderDragData = {
  isEqual(oldState, newState) {
    return oldState.draggedTab === newState.draggedTab
  },
  apply(oldState, newState) {
    const { draggedTab, uid } = newState
    return [
      'Viewlet.setDragData',
      uid,
      {
        items: draggedTab ? [{ type: 'application/x-lvce-simple-browser-tab', data: String(uid) }] : [],
        label: draggedTab?.title || 'New Tab',
      },
    ]
  },
}
