import * as GetKeyBindingsVirtualDom from '../GetKeyBindingsVirtualDom/GetKeyBindingsVirtualDom.js'
import * as GetVisibleKeyBindings from '../GetVisibleKeyBindings/GetVisibleKeyBindings.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as DiffDom from '../DiffDom/DiffDom.js'

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredKeyBindings === newState.filteredKeyBindings &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.columnWidth1 === newState.columnWidth1 &&
      oldState.columnWidth2 === newState.columnWidth2 &&
      oldState.columnWidth3 === newState.columnWidth3
    )
  },
  apply(oldState, newState) {
    const { filteredKeyBindings, minLineY, maxLineY, selectedIndex, columnWidth1, columnWidth2, columnWidth3 } = newState
    const displayKeyBindings = GetVisibleKeyBindings.getVisibleKeyBindings(filteredKeyBindings, minLineY, maxLineY, selectedIndex)
    // TODO do dom diffing for faster incremental updates, e.g. when scrolling
    // console.time('tableDom')
    const tableDom = GetKeyBindingsVirtualDom.getTableDom(filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3)
    // console.timeEnd('tableDom')
    // console.log({ tableDom })
    newState._tableDom = tableDom
    const oldDom = oldState._tableDom || []
    const diff = DiffDom.diffDom(oldDom, tableDom)
    console.log({ diff })
    return [/* method */ 'setDiff', /* tableDom */ diff]
  },
}

const renderColumnWidths = {
  isEqual(oldState, newState) {
    return (
      oldState.columnWidth1 === newState.columnWidth1 &&
      oldState.columnWidth2 === newState.columnWidth2 &&
      oldState.columnWidth3 === newState.columnWidth3
    )
  },
  apply(oldState, newState) {
    return [/* method */ 'setColumnWidths', newState.columnWidth1, newState.columnWidth2, newState.columnWidth3]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ 'setValue', /* setValue */ newState.value]
  },
}

const renderNoResults = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value && newState.filteredKeyBindings.length === 0
  },
  apply(oldState, newState) {
    const message = newState.filteredKeyBindings.length === 0 ? 'No Results found' : ''
    return [/* Viewlet.ariaAnnounce */ 'Viewlet.ariaAnnounce', /* message */ message]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY
    )
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

export const render = [renderKeyBindings, renderValue, renderNoResults, renderScrollBar, renderColumnWidths]
