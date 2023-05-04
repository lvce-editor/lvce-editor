import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as GetTabsVirtualDom from '../GetTabsVirtualDom/GetTabsVirtualDom.js'

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
    const oldGroups = oldState.groups
    const newGroups = newState.groups
    const insertedGroups = []
    const deletedGroups = []
    const oldUids = []
    const newUids = []
    for (const oldGroup of oldGroups) {
      oldUids.push(oldGroup.uid)
    }
    for (const newGroup of newGroups) {
      newUids.push(newGroup.uid)
    }
    for (const oldGroup of oldGroups) {
      if (!newUids.includes(oldGroup.uid)) {
        deletedGroups.push(oldGroup)
      }
    }
    for (const newGroup of newGroups) {
      const index = oldUids.indexOf(newGroup.uid)
      if (index === -1) {
        insertedGroups.push(newGroup)
      } else {
        const oldGroup = oldGroups[index]
        const { tabsUid, editors, x, y, width, height, activeIndex } = newGroup
        commands.push(['Viewlet.send', tabsUid, 'setTabs', editors])
        const unFocusIndex = oldGroup.activeIndex < editors.length ? oldGroup.activeIndex : -1
        commands.push(['Viewlet.send', tabsUid, 'setFocusedIndex', unFocusIndex, activeIndex])
      }
    }
    for (const insertedGroup of insertedGroups) {
      const { tabsUid, editors, x, y, width, height, activeIndex } = insertedGroup
      commands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
      commands.push(['Viewlet.setBounds', tabsUid, x, y, width, newState.tabHeight])
      const tabsDom = GetTabsVirtualDom.getTabsDom(editors, activeIndex)
      commands.push(['Viewlet.send', tabsUid, 'setTabsDom', tabsDom])
      // commands.push(['Viewlet.send', tabsUid, 'setFocusedIndex', -1, activeIndex])
      commands.push(['Viewlet.append', newState.uid, tabsUid])
    }
    for (const group of deletedGroups) {
      commands.push(['Viewlet.dispose', group.tabsUid])
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

export const render = [renderDragOverlay, renderGroupTabs, renderTabsActiveIndex]
