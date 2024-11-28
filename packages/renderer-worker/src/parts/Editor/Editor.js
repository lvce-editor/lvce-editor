import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as EditorScrolling from './EditorScrolling.js'

// TODO
export const create = (id, uri, languageId) => {
  // TODO flatten structure
  return {
    uri,
    languageId,
    lines: [],
    // TODO cursor should be part of selection,
    // codemirror has selections: Selection[]
    //            selectionIndex: number

    // TODO how to get the trigger characters here from extension host
    completionTriggerCharacters: [],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    id,
    uid: id,
    deltaX: 0,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    numberOfVisibleLines: 0,
    finalY: 0,
    finalDeltaY: 0,
    height: 0,
    y: 0,
    x: 0,
    columnWidth: 0,
    rowHeight: 0,
    fontSize: 15, // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
    letterSpacing: 0,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    undoStack: [],
    // TODO maybe put these into separate tokenization module
    lineCache: [],
    validLines: [],
    invalidStartIndex: 0,
    decorations: [],
    focused: false,
    /**
     * Offset at which the vertical scrollbar thumb has been clicked
     * TODO: rename this to handleOffsetY
     */
    handleOffset: 0,
    /**
     * Offset at which the horizontal scrollbar thumb has been clicked
     */
    handleOffsetX: 0,
    itemHeight: 20,
    fontFamily: '',
    fontWeight: 400,
    tabSize: 2,
    cursorWidth: 2,
    completionState: EditorCompletionState.None,
    longestLineWidth: 0,
    minimumSliderSize: MinimumSliderSize.minimumSliderSize,
    differences: [],
    width: 0,
    completionUid: 0,
    lineNumbers: false,
    tokenizerId: 0,
  }
}

// TODO
export const setDeltaYFixedValue = (editor, value) => {
  return EditorScrolling.setDeltaY(editor, value)
}

export const setBounds = (editor, x, y, width, height, columnWidth) => {
  const { itemHeight } = editor
  const numberOfVisibleLines = Math.floor(height / itemHeight)
  const total = editor.lines.length
  const maxLineY = Math.min(numberOfVisibleLines, total)
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  return {
    ...editor,
    x,
    y,
    width,
    height,
    columnWidth,
    numberOfVisibleLines,
    maxLineY,
    finalY,
    finalDeltaY,
  }
}

export * from './EditorRender.js'
