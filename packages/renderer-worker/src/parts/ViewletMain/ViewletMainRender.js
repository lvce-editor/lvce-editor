import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

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

const getTotalTabWidth = (editors) => {
  let total = 0
  for (const editor of editors) {
    total += editor.tabWidth
  }
  return total
}

const renderGroupTabs = {
  isEqual(oldState, newState) {
    return oldState.groups === newState.groups
  },
  apply(oldState, newState) {
    const commands = []
    for (const group of newState.groups) {
      commands.push(['Viewlet.create', ViewletModuleId.MainTabs, group.tabsUid])
      commands.push(['Viewlet.setBounds', group.tabsUid, group.x, group.y, group.width, newState.tabHeight])
      commands.push(['Viewlet.append', newState.uid, group.tabsUid])
    }
    // if (oldState.tabsUid === -1 && newState.tabsUid !== -1) {
    // }

    // if (newState.tabsUid === -1) {
    //   if (oldState.tabsUid !== -1) {
    //     commands.push(['Viewlet.dispose', oldState.tabsUid])
    //   }
    // } else {
    //   commands.push(['Viewlet.send', newState.tabsUid, 'setTabs', newState.editors])
    // }
    // const totalTabWidth = getTotalTabWidth(newState.editors)
    // if (totalTabWidth > newState.width) {
    //   console.log('render scrollbar')
    //   // const scrollBarPercentage =  totalTabWidth
    //   const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(newState.width, totalTabWidth, 20)
    //   commands.push(['Viewlet.send', newState.tabsUid, 'setScrollBar', scrollBarWidth])
    //   // TODO render scrollbar
    // }
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

export const render = [renderDragOverlay, renderGroupTabs, renderTabsActiveIndex]
