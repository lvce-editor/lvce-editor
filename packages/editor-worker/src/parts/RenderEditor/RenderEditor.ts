import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.js'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as GetIncrementalEdits from '../GetIncrementalEdits/GetIncrementalEdits.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

const renderLines = {
  isEqual(oldState: any, newState: any) {
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
  apply(oldState: any, newState: any) {
    const incrementalEdits = GetIncrementalEdits.getIncrementalEdits(oldState, newState)
    if (incrementalEdits) {
      return [/* method */ 'setIncrementalEdits', /* incrementalEdits */ incrementalEdits]
    }
    const { textInfos, differences } = EditorText.getVisible(newState)
    newState.differences = differences
    const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences)
    return [/* method */ 'setText', dom]
  },
}

const renderSelections = {
  isEqual(oldState: any, newState: any) {
    return (
      oldState.selections === newState.selections &&
      oldState.focused === newState.focused &&
      oldState.minLineY === newState.minLineY &&
      oldState.deltaX === newState.deltaX
    )
  },
  apply(oldState: any, newState: any) {
    const { cursorInfos, selectionInfos } = EditorSelection.getVisible(newState)
    const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfos)
    const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
    return [/* method */ 'setSelections', cursorsDom, selectionsDom]
  },
}

const renderScrollBarY = {
  isEqual(oldState: any, newState: any) {
    return oldState.deltaY === newState.deltaY && oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState: any, newState: any) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    const translate = `0 ${scrollBarY}px`
    const heightPx = `${newState.scrollBarHeight}px`
    return [/* method */ 'setScrollBar', translate, heightPx]
  },
}

const renderScrollBarX = {
  isEqual(oldState: any, newState: any) {
    return oldState.longestLineWidth === newState.longestLineWidth && oldState.deltaX === newState.deltaX
  },
  apply(oldState: any, newState: any) {
    const scrollBarWidth = ScrollBarFunctions.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize)
    const scrollBarX = (newState.deltaX / newState.longestLineWidth) * newState.width
    return [/* method */ 'setScrollBarHorizontal', /* scrollBarX */ scrollBarX, /* scrollBarWidth */ scrollBarWidth, /* deltaX */ newState.deltaX]
  },
}

const renderFocus = {
  isEqual(oldState: any, newState: any) {
    return oldState.focused === newState.focused
  },
  apply(oldState: any, newState: any) {
    return [/* method */ 'setFocused', newState.focused]
  },
}

const renderDecorations = {
  isEqual(oldState: any, newState: any) {
    return oldState.decorations === newState.decorations
  },
  apply(oldState: any, newState: any) {
    const dom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(newState.decorations)
    return ['setDecorationsDom', dom]
  },
}

const renderGutterInfo = {
  isEqual(oldState: any, newState: any) {
    return oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState: any, newState: any) {
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
