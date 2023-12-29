import * as GetExtensionHeaderVirtualDom from '../GetExtensionHeaderVirtualDom/GetExtensionHeaderVirtualDom.js'
import * as GetExtensionsVirtualDom from '../GetExtensionsVirtualDom/GetExtensionsVirtualDom.js'
import * as GetVisibleExtensions from '../GetVisibleExtensions/GetVisibleExtensions.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import { getListHeight } from './ViewletExtensionsShared.js'

export const hasFunctionalRender = true

const renderExtensions = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.deltaY === newState.deltaY &&
      oldState.focusedIndex === newState.focusedIndex
    )
  },
  apply(oldState, newState) {
    // TODO render extensions incrementally when scrolling
    const visibleExtensions = GetVisibleExtensions.getVisible(newState)
    const dom = GetExtensionsVirtualDom.getExtensionsVirtualDom(visibleExtensions)
    return ['setExtensionsDom', dom]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY &&
      oldState.items.length === newState.items.length
    )
  },
  apply(oldState, newState) {
    const listHeight = getListHeight(newState)
    const total = newState.items.length
    const contentHeight = total * newState.itemHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(listHeight, contentHeight, newState.minimumSliderSize)
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      scrollBarHeight,
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ scrollBarHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetMessage, /* message */ newState.message]
  },
}

const renderSearchValue = {
  isEqual(oldState, newState) {
    return oldState.searchValue === newState.searchValue
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSearchValue, oldState.searchValue, newState.searchValue]
  },
}

const renderHeader = {
  isEqual(oldState, newState) {
    return oldState.placeholder === newState.placeholder
  },
  apply(oldState, newState) {
    console.log(newState.placeholder)
    const dom = GetExtensionHeaderVirtualDom.getExtensionHeaderVirtualDom(newState.placeholder)
    return ['setHeaderDom', dom]
  },
}

export const render = [renderScrollBar, renderMessage, renderExtensions, renderSearchValue, renderHeader]
