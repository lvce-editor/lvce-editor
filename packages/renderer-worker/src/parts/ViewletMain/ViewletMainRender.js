import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const hasFunctionalRender = true

const renderDragOverlay = {
  isEqual(oldState, newState) {
    return (
      oldState.dragOverlayVisible === newState.dragOverlayVisible &&
      oldState.dragOverlayX === newState.dragOverlayX &&
      oldState.dragOverlayY === newState.dragOverlayY &&
      oldState.dragOverlayWidth === newState.dragOverlayWidth &&
      oldState.dragOverlayHeight === newState.dragOverlayHeight
    )
  },
  apply(oldState, newState) {
    return [
      'setDragOverlay',
      newState.dragOverlayVisible,
      newState.dragOverlayX,
      newState.dragOverlayY,
      newState.dragOverlayWidth,
      newState.dragOverlayHeight,
    ]
  },
}

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.editors === newState.editors && oldState.tabsUid === newState.tabsUid
  },
  apply(oldState, newState) {
    const commands = []
    if (oldState.tabsUid === -1 && newState.tabsUid !== -1) {
      commands.push(['Viewlet.create', ViewletModuleId.MainTabs, newState.tabsUid])
      commands.push(['Viewlet.setBounds', newState.tabsUid, newState.x, 0, newState.width, newState.tabHeight])
      commands.push(['Viewlet.append', newState.uid, newState.tabsUid])
    }
    if (newState.tabsUid === -1) {
      if (oldState.tabsUid !== -1) {
        commands.push(['Viewlet.dispose', oldState.tabsUid])
      }
    } else {
      commands.push(['Viewlet.send', newState.tabsUid, 'setTabs', newState.editors])
    }
    return commands
  },
  multiple: true,
}

const renderTabsActiveIndex = {
  isEqual(oldState, newState) {
    return oldState.editors === newState.editors && oldState.activeIndex === newState.activeIndex
  },
  apply(oldState, newState) {
    const unFocusIndex = oldState.activeIndex < newState.editors.length ? oldState.activeIndex : -1
    if (newState.activeIndex === -1) {
      return []
    }
    return [['Viewlet.send', newState.tabsUid, 'setFocusedIndex', unFocusIndex, newState.activeIndex]]
  },
  multiple: true,
}

export const render = [renderDragOverlay, renderTabs, renderTabsActiveIndex]
