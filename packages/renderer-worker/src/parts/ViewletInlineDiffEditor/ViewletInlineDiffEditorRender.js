import * as GetDiffEditorVirtualDom from '../GetDiffEditorVirtualDom/GetDiffEditorVirtualDom.js'
import * as GetVisibleDiffLinesWithTokens from '../GetVisibleDiffLinesWithTokens/GetVisibleDiffLinesWithTokens.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.changes === newState.changes && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const mergedLeft = GetVisibleDiffLinesWithTokens.getVisibleDiffLinesWithTokens(
      newState.linesLeft,
      newState.changes.changesLeft,
      newState.minLineY,
      newState.maxLineY,
      newState.languageLeft,
    )
    const mergedRight = GetVisibleDiffLinesWithTokens.getVisibleDiffLinesWithTokens(
      newState.linesRight,
      newState.changes.changesRight,
      newState.minLineY,
      newState.maxLineY,
      newState.languageRight,
    )
    const dom = GetDiffEditorVirtualDom.getDiffEditorVirtualDom(mergedLeft, mergedRight)
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
