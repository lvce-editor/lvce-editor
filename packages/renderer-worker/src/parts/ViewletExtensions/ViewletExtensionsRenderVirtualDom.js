import * as GetExtensionsVirtualDom from '../GetExtensionsVirtualDom/GetExtensionsVirtualDom.js'
import * as GetVisibleExtensions from '../GetVisibleExtensions/GetVisibleExtensions.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import { getListHeight } from './ViewletExtensionsShared.js'

export const hasFunctionalRender = true

const renderExtensions = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    // TODO render extensions incrementally when scrolling
    const visibleExtensions = GetVisibleExtensions.getVisible(newState)
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    const listHeight = getListHeight(newState)
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(listHeight, contentHeight, newState.minimumSliderSize)
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      scrollBarHeight
    )
    const dom = GetExtensionsVirtualDom.getExtensionsVirtualDom(visibleExtensions, contentHeight, -newState.deltaY, scrollBarY, scrollBarHeight)
    return ['setDom', dom]
  },
}

export const render = [renderExtensions]
