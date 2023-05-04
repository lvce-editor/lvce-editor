import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as GetVisibleActivityBarItems from '../GetVisibleActivityBarItems/GetVisibleActivityBarItems.js'

/**
 * @enum {string}
 */
const ClassNames = {
  KeyBindingsTableRow: 'KeyBindingsTableRow',
}

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.activityBarItems === newState.activityBarItems &&
      oldState.height === newState.height &&
      oldState.selectedIndex === newState.selectedIndex
    )
  },
  apply(oldState, newState) {
    const visibleItems = GetVisibleActivityBarItems.getVisibleActivityBarItems(newState)
    const dom = GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems, newState.selectedIndex)
    return ['setDom', dom]
  },
}

export const render = [renderItems]

export const hasFunctionalRender = true
