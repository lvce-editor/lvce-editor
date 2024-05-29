import * as GetInlineDiffEditorVirtualDom from '../GetInlineDiffEditorVirtualDom/GetInlineDiffEditorVirtualDom.js'
import * as GetVisibleDiffLinesWithTokens from '../GetVisibleDiffLinesWithTokens/GetVisibleDiffLinesWithTokens.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as GetInlineDiffEditorLines from '../GetInlineDiffEditorLines/GetInlineDiffEditorLines.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.chanesLeft === newState.changesLeft && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const lines = GetInlineDiffEditorLines.getInlineDiffEditorLines(
      newState.linesLeft,
      newState.linesRight,
      newState.changesLeft,
      newState.changesRight,
    )
    const dom = GetInlineDiffEditorVirtualDom.getInlineDiffEditorVirtualDom(lines)
    return ['Viewlet.setDom2', dom]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.height === newState.height && oldState.finalDeltaY === newState.finalDeltaY
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight,
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

export const render = [renderChanges, renderScrollBar]
