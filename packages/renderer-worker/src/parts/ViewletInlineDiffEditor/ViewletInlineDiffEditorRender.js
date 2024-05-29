import * as GetInlineDiffEditorVirtualDom from '../GetInlineDiffEditorVirtualDom/GetInlineDiffEditorVirtualDom.js'
import * as GetVisibleDiffLinesWithTokens from '../GetVisibleDiffLinesWithTokens/GetVisibleDiffLinesWithTokens.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as GetInlineDiffEditorLines from '../GetInlineDiffEditorLines/GetInlineDiffEditorLines.js'

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
      oldState.finalDeltaY === newState.finalDeltaY
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
    const dom = GetInlineDiffEditorVirtualDom.getInlineDiffEditorVirtualDom(lines, scrollBarY, scrollBarHeight)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderChanges]
