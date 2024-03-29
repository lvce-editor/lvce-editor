import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as GetVisibleActivityBarItems from '../GetVisibleActivityBarItems/GetVisibleActivityBarItems.js'

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.activityBarItems === newState.activityBarItems &&
      oldState.height === newState.height &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.focusedIndex === newState.focusedIndex
    )
  },
  apply(oldState, newState) {
    const visibleItems = GetVisibleActivityBarItems.getVisibleActivityBarItems(newState)
    const dom = GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems)
    return ['setDom', dom]
  },
}

export const render = [renderItems]

export const hasFunctionalRender = true
