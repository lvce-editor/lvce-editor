import * as ActionType from '../ActionType/ActionType.js'
import * as GetExtensionsVirtualDom from '../GetExtensionsVirtualDom/GetExtensionsVirtualDom.js'
import * as GetVisibleExtensions from '../GetVisibleExtensions/GetVisibleExtensions.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletExtensionStrings from '../ViewletExtensions/ViewletExtensionsStrings.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

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
    const actions = [
      {
        type: ActionType.Button,
        title: ViewletExtensionStrings.clearExtensionSearchResults(),
        icon: `MaskIcon${MaskIcon.ClearAll}`,
        command: 'Extensions.clearSearchResults',
      },
      {
        type: ActionType.Button,
        title: ViewletExtensionStrings.filter(),
        icon: `MaskIcon${MaskIcon.Filter}`,
      },
    ]
    const dom = GetExtensionsVirtualDom.getExtensionsVirtualDom(visibleExtensions, newState.placeholder, actions)
    return ['Viewlet.setDom2', dom]
  },
}

// const renderScrollBar = {
//   isEqual(oldState, newState) {
//     return (
//       oldState.negativeMargin === newState.negativeMargin &&
//       oldState.deltaY === newState.deltaY &&
//       oldState.height === newState.height &&
//       oldState.finalDeltaY === newState.finalDeltaY &&
//       oldState.items.length === newState.items.length &&
//       oldState.scrollBarActive === newState.scrollBarActive
//     )
//   },
//   apply(oldState, newState) {
//     const listHeight = getListHeight(newState)
//     const total = newState.items.length
//     const contentHeight = total * newState.itemHeight
//     const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(listHeight, contentHeight, newState.minimumSliderSize)
//     const scrollBarY = ScrollBarFunctions.getScrollBarY(
//       newState.deltaY,
//       newState.finalDeltaY,
//       newState.height - newState.headerHeight,
//       scrollBarHeight,
//     )
//     const heightString = `${scrollBarHeight}px`
//     const translateString = `0 ${scrollBarY}px`
//     let className = 'ScrollBarThumb'
//     if (newState.scrollBarActive) {
//       className += ' ScrollBarThumbActive'
//     }
//     return [/* method */ RenderMethod.SetScrollBar, translateString, heightString, className]
//   },
// }

export const render = [renderExtensions]
