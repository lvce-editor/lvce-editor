import * as GetTabsVirtualDom from '../GetTabsVirtualDom/GetTabsVirtualDom.js'
import * as PartitionEditorGroups from '../PartitionEditorGroups/PartitionEditorGroups.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as GetVisibleTabs from '../GetVisibleTabs/GetVisibleTabs.js'

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

const renderGroupTabs = {
  isEqual(oldState, newState) {
    return oldState.groups === newState.groups
  },
  apply(oldState, newState) {
    const commands = []
    const oldGroups = oldState.groups
    const newGroups = newState.groups
    const { insertedGroups, deletedGroups, updatedGroups } = PartitionEditorGroups.partitionEditorGroups(oldGroups, newGroups)
    for (const { oldGroup, newGroup } of updatedGroups) {
      const { tabsUid, editors, x, y, width, activeIndex, tabsDeltaX } = newGroup
      if (oldGroup.editors.length === 0) {
        insertedGroups.push(newGroup)
      }
      if (editors !== oldGroup.editors || activeIndex !== oldGroup.activeIndex) {
        const visibleTabs = GetVisibleTabs.getVisibleTabs(editors, newState.width, activeIndex, 0)
        const tabsDom = GetTabsVirtualDom.getTabsDom(visibleTabs)
        commands.push(['Viewlet.send', tabsUid, 'setTabsDom', tabsDom])
      }
      if (width !== oldGroup.width) {
        commands.push(['Viewlet.setBounds', tabsUid, x, y, width, newState.tabHeight])
      }
      if (tabsDeltaX !== oldGroup.tabsDeltaX) {
        commands.push(['Viewlet.send', tabsUid, 'setScrollLeft', tabsDeltaX])
      }
      if (oldGroup.highlight !== newGroup.highlight || oldGroup.highlightLeft !== newGroup.highlightLeft) {
        commands.push(['Viewlet.send', tabsUid, 'setHighlight', newGroup.highlightLeft])
      }
    }
    for (const insertedGroup of insertedGroups) {
      const { tabsUid, editors, x, y, width, activeIndex, tabsDeltaX } = insertedGroup
      if (editors.length > 0) {
        commands.push(['Viewlet.create', ViewletModuleId.MainTabs, tabsUid])
        commands.push(['Viewlet.setBounds', tabsUid, x, y, width, newState.tabHeight])
        const visibleTabs = GetVisibleTabs.getVisibleTabs(editors, newState.width, activeIndex, 0)
        const tabsDom = GetTabsVirtualDom.getTabsDom(visibleTabs)
        commands.push(['Viewlet.send', tabsUid, 'setTabsDom', tabsDom])
        commands.push(['Viewlet.send', tabsUid, 'setScrollLeft', tabsDeltaX])
        commands.push(['Viewlet.append', newState.uid, tabsUid])
      }
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

// const renderDragInfo = {
//   isEqual(oldState, newState) {
//     return oldState.groups === newState.groups
//   },
//   apply(oldState, newState) {
//     const dragInfo = Object.create(null)
//     for (const group of newState.groups) {
//       // TODO
//     }
//     // TODO send drag infos to renderer process
//     const unFocusIndex = oldState.activeIndex < newState.editors.length ? oldState.activeIndex : -1
//     if (newState.activeIndex === -1) {
//       return []
//     }
//     return [['Viewlet.send', newState.tabsUid, 'setFocusedIndex', unFocusIndex, newState.activeIndex]]
//   },
//   multiple: true,
// }

export const render = [renderDragOverlay, renderGroupTabs, renderTabsActiveIndex]
