import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.js'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.js'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.js'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.js'
import * as GetIncrementalEdits from '../GetIncrementalEdits/GetIncrementalEdits.js'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as EditorSelection from './EditorSelection.js'
import * as EditorText from './EditorText.js'

const renderLines = {
  isEqual(oldState, newState) {
    return (
      JSON.stringify(oldState.lines) === JSON.stringify(newState.lines) &&
      oldState.tokenizerId === newState.tokenizerId &&
      oldState.minLineY === newState.minLineY &&
      JSON.stringify(oldState.decorations) === JSON.stringify(newState.decorations) &&
      JSON.stringify(oldState.embeds) === JSON.stringify(newState.embeds) &&
      oldState.deltaX === newState.deltaX &&
      oldState.width === newState.width
    )
  },
  apply(oldState, newState) {
    console.log({ tokId: newState.tokenizerId })
    const incrementalEdits = GetIncrementalEdits.getIncrementalEdits(oldState, newState)
    if (incrementalEdits) {
      return [/* method */ 'setIncrementalEdits', /* incrementalEdits */ incrementalEdits]
    }
    const { textInfos, differences } = EditorText.getVisible(newState)
    newState.differences = differences
    console.log({ textInfos, differences })
    const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences)
    return [/* method */ 'setText', dom]
  },
}

const renderSelections = {
  isEqual(oldState, newState) {
    return (
      oldState.selections === newState.selections &&
      oldState.focused === newState.focused &&
      oldState.minLineY === newState.minLineY &&
      oldState.deltaX === newState.deltaX
    )
  },
  apply(oldState, newState) {
    const { cursorInfos, selectionInfos } = EditorSelection.getVisible(newState)
    const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfos)
    const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
    return [/* method */ 'setSelections', cursorsDom, selectionsDom]
  },
}

const renderScrollBarY = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    const translate = `0 ${scrollBarY}px`
    const heightPx = `${newState.scrollBarHeight}px`
    return [/* method */ 'setScrollBar', translate, heightPx]
  },
}

const renderScrollBarX = {
  isEqual(oldState, newState) {
    return oldState.longestLineWidth === newState.longestLineWidth && oldState.deltaX === newState.deltaX
  },
  apply(oldState, newState) {
    const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize)
    const scrollBarX = (newState.deltaX / newState.longestLineWidth) * newState.width
    return [/* method */ 'setScrollBarHorizontal', /* scrollBarX */ scrollBarX, /* scrollBarWidth */ scrollBarWidth, /* deltaX */ newState.deltaX]
  },
}

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return [/* method */ 'setFocused', newState.focused]
  },
}

const renderDecorations = {
  isEqual(oldState, newState) {
    return oldState.decorations === newState.decorations
  },
  apply(oldState, newState) {
    const dom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(newState.decorations)
    return ['setDecorationsDom', dom]
  },
}

const renderGutterInfo = {
  isEqual(oldState, newState) {
    return oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const { minLineY, maxLineY, lineNumbers } = newState
    const gutterInfos = []
    if (lineNumbers) {
      for (let i = minLineY; i < maxLineY; i++) {
        gutterInfos.push(i + 1)
      }
    }
    const dom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom(gutterInfos)
    return ['renderGutter', dom]
  },
}

export const render = [renderLines, renderSelections, renderScrollBarX, renderScrollBarY, renderFocus, renderDecorations, renderGutterInfo]
