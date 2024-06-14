import * as GetActivityBarVirtualDom from '../GetActivityBarVirtualDom/GetActivityBarVirtualDom.js'
import * as GetVisibleActivityBarItems from '../GetVisibleActivityBarItems/GetVisibleActivityBarItems.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredItems === newState.filteredItems &&
      oldState.height === newState.height &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.focusedIndex === newState.focusedIndex
    )
  },
  apply(oldState, newState) {
    const visibleItems = GetVisibleActivityBarItems.getVisibleActivityBarItems(newState)
    const dom = GetActivityBarVirtualDom.getActivityBarVirtualDom(visibleItems)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderItems]
