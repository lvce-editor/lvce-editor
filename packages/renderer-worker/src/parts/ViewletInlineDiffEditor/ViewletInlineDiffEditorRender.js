import * as GetInlineDiffEditorLines from '../GetInlineDiffEditorLines/GetInlineDiffEditorLines.js'
import * as GetInlineDiffEditorVirtualDom from '../GetInlineDiffEditorVirtualDom/GetInlineDiffEditorVirtualDom.js'
import * as GetVisibleInlineDiffEditorLines from '../GetVisibleInlineDiffEditorLines/GetVisibleInlineDiffEditorLines.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderChanges = {
  isEqual(oldState, newState) {
    return (
      oldState.chanesLeft === newState.changesLeft &&
        oldState.minLineY === newState.minLineY &&
        oldState.maxLineY === newState.maxLineY &&
        oldState.deltaY === newState.deltaY &&
        oldState.height === newState.height &&
        oldState.finalDeltaY === newState.finalDeltaY,
      oldState.lineNumbers === newState.lineNumbers
    )
  },
  apply(oldState, newState) {
    const lines = GetInlineDiffEditorLines.getInlineDiffEditorLines(
      newState.linesLeft,
      newState.linesRight,
      newState.changesLeft,
      newState.changesRight,
    )
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    const size = lines.length * newState.itemHeight
    const minimumSliderSize = 20
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(newState.height, size, minimumSliderSize)
    const visibleLines = GetVisibleInlineDiffEditorLines.getVisibleInlineDiffEditorLines(lines, newState.minLineY, newState.maxLineY)
    const dom = GetInlineDiffEditorVirtualDom.getInlineDiffEditorVirtualDom(visibleLines, scrollBarY, scrollBarHeight, newState.lineNumbers)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderChanges]
