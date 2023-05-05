import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as GetVisibleActivityBarItems from '../GetVisibleActivityBarItems/GetVisibleActivityBarItems.js'
import * as DiffDom from '../DiffDom/DiffDom.js'

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
    const dom = GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems, newState.selectedIndex, newState.focusedIndex)
    const oldDom = oldState._dom || []
    const diff = DiffDom.diffDom(oldDom, dom)
    newState._dom = dom
    return ['setDiff', diff]
  },
}

export const render = [renderItems]

export const hasFunctionalRender = true
