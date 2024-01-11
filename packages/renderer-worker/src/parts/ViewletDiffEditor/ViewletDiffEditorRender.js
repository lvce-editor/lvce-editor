import * as GetDiffEditorVirtualDom from '../GetDiffEditorVirtualDom/GetDiffEditorVirtualDom.js'
import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.js'
import * as GetVisibleDiffLines from '../GetVisibleDiffLines/GetVisibleDiffLines.js'
import * as MergeDiffLinesWithTokens from '../MergeDiffLinesWithTokens/MergeDiffLinesWithTokens.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'

export const hasFunctionalRender = true

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.changes === newState.changes && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const leftVisible = GetVisibleDiffLines.getVisibleDiffLines(
      newState.linesLeft,
      newState.changes.changesLeft,
      newState.minLineY,
      newState.maxLineY,
    )
    const rightVisible = GetVisibleDiffLines.getVisibleDiffLines(
      newState.linesRight,
      newState.changes.changesRight,
      newState.minLineY,
      newState.maxLineY,
    )
    const tokenizer = Tokenizer.getTokenizer(newState.languageRight)
    const { tokens } = GetTokensViewport.getTokensViewport(
      {
        invalidStartIndex: 0,
        lineCache: [],
        tokenizer,
        lines: newState.linesRight,
        languageId: newState.languageRight,
      },
      newState.minLineY,
      newState.maxLineY,
    )
    const mergedRight = MergeDiffLinesWithTokens.mergeDiffLinesWithTokens(rightVisible, tokens, tokenizer.TokenMap)
    const dom = GetDiffEditorVirtualDom.getDiffEditorVirtualDom(leftVisible, mergedRight)
    return ['setDom', dom]
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
