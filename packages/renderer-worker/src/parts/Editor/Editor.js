import * as Assert from '../Assert/Assert.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as Id from '../Id/Id.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.js'
import * as EditorScrolling from './EditorScrolling.js'
import * as EditorSelection from './EditorSelection.js'
import * as EditorText from './EditorText.js'

// TODO
export const create = (id, uri, languageId, content) => {
  // TODO flatten structure
  return {
    uri,
    languageId,
    lines: SplitLines.splitLines(content),
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

export const dispose = (id) => {
  // delete state.editors[id]
}

export const renderText = (editor) => {
  Assert.object(editor)
  const textInfos = EditorText.getVisible(editor)
  RendererProcess.invoke(
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'EditorText',
    /* method */ 'renderText',
    /* scrollBarY */ editor.scrollBarY,
    /* scrollBarHeight */ editor.scrollBarHeight,
    /* textInfos */ textInfos,
    /* fontSize */ editor.fontSize, // TODO only send these properties once on first render
    /* lineHeight */ editor.rowHeight,
    /* letterSpacing */ editor.letterSpacing,
  )
}

export const setTokenizer = (editor, tokenizer) => {
  const tokenizerId = Id.create()
  TokenizerMap.set(tokenizerId, Tokenizer.getTokenizer(editor.languageId))
  editor.invalidStartIndex = 0
  editor.tokenizerId = tokenizerId
}

// TODO
export const setDeltaYFixedValue = (editor, value) => {
  return EditorScrolling.setDeltaY(editor, value)
}

export const setDeltaY = (editor, value) => {
  return setDeltaYFixedValue(editor, editor.deltaY + value)
}

export const scheduleSelections = (editor, selectionEdits) => {
  return EditorSelection.setSelections(editor, selectionEdits)
}

export const scheduleSelectionsAndScrollPosition = (editor, selectionEdits, deltaY) => {
  Assert.object(editor)
  Assert.uint32array(selectionEdits)
  Assert.number(deltaY)
  const newEditor1 = EditorSelection.setSelections(editor, selectionEdits)
  const newEditor2 = EditorScrolling.setDeltaY(newEditor1, deltaY)
  return newEditor2
  // EditorScrolling.setDeltaY(editor, deltaY)
  // EditorSelection.setSelections(editor, selectionEdits)
  // const cursorInfos = EditorCursor.getVisible(editor)
  // const selectionInfos = EditorSelection.getVisible(editor)
  // const textInfos = EditorText.getVisible(editor)
  // // TODO scrollbar calculation duplicate code
  // const scrollBarY =
  //   (editor.deltaY / editor.finalDeltaY) *
  //   (editor.height - editor.scrollBarHeight)
  // const scrollBarHeight = editor.scrollBarHeight
  // RendererProcess.send([
  //   /* Viewlet.invoke */ 'Viewlet.send',
  //   /* id */ 'EditorText',
  //   /* method */ 'renderTextAndCursorsAndSelections',
  //   /* deltaY */ scrollBarY,
  //   /* scrollBarHeight */ scrollBarHeight,
  //   /* textInfos */ textInfos,
  //   /* cursorInfos */ cursorInfos,
  //   /* selectionInfos */ selectionInfos,
  // ])
}

const isAutoClosingChange = (change) => {
  return change.origin === EditOrigin.EditorTypeWithAutoClosing
}

const applyAutoClosingRangesEdit = (editor, changes) => {
  const { autoClosingRanges = [] } = editor
  const newAutoClosingRanges = []
  const change = changes[0]
  const changeStartRowIndex = change.start.rowIndex
  const changeStartColumnIndex = change.start.columnIndex
  const changeEndRowIndex = change.end.rowIndex
  const changeEndColumnIndex = change.end.columnIndex
  for (let i = 0; i < autoClosingRanges.length; i += 4) {
    const autoStartRowIndex = autoClosingRanges[i]
    const autoStartColumnIndex = autoClosingRanges[i + 1]
    const autoEndRowIndex = autoClosingRanges[i + 2]
    const autoEndColumnIndex = autoClosingRanges[i + 3]
    if (changeEndRowIndex === autoEndRowIndex && changeEndColumnIndex === autoEndColumnIndex) {
      const delta = change.inserted[0].length - change.deleted[0].length
      newAutoClosingRanges.push(autoStartRowIndex, autoStartColumnIndex, autoEndRowIndex, autoEndColumnIndex + delta)
    } else if (
      changeStartRowIndex === autoStartRowIndex &&
      changeStartColumnIndex >= autoStartColumnIndex &&
      changeEndRowIndex === autoEndRowIndex &&
      changeEndColumnIndex <= autoEndColumnIndex
    ) {
      const delta = change.inserted[0].length - change.deleted[0].length
      newAutoClosingRanges.push(autoStartRowIndex, autoStartColumnIndex, autoEndRowIndex, autoEndColumnIndex + delta)
    } else {
      // ignore
    }
  }
  if (isAutoClosingChange(change)) {
    newAutoClosingRanges.push(changeStartRowIndex, changeStartColumnIndex + 1, changeEndRowIndex, changeEndColumnIndex + 1)
  }
  return newAutoClosingRanges
}

/**
 *
 * @param {any} editor
 * @param {any[]} changes
 * @param {Uint32Array|undefined} selectionChanges
 * @returns
 */
export const scheduleDocumentAndCursorsSelections = (editor, changes, selectionChanges = undefined) => {
  Assert.object(editor)
  Assert.array(changes)
  if (changes.length === 0) {
    return editor
  }
  const newLines = TextDocument.applyEdits(editor, changes)
  const partialNewEditor = {
    ...editor,
    lines: newLines,
  }
  const newSelections = selectionChanges || EditorSelection.applyEdit(partialNewEditor, changes)
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  const invalidStartIndex = Math.min(editor.invalidStartIndex, changes[0].start.rowIndex)

  // TODO maybe put undostack into indexeddb so that there is no memory leak in application
  // then clear old undostack from indexeddb after 3 days
  // TODO should push to undostack after rendering
  const autoClosingRanges = applyAutoClosingRangesEdit(editor, changes)

  const newEditor = {
    ...partialNewEditor,
    lines: newLines,
    selections: newSelections,
    undoStack: [...editor.undoStack, changes],
    invalidStartIndex,
    autoClosingRanges,
  }
  GlobalEventBus.emitEvent('editor.change', newEditor, changes)

  return newEditor
}

export const hasSelection = (editor) => {
  // TODO editor.selections should always be defined
  return editor.selections && editor.selections.length > 0
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

export const setText = (editor, text) => {
  const lines = SplitLines.splitLines(text)
  const { itemHeight, numberOfVisibleLines, minimumSliderSize } = editor
  const total = lines.length
  const maxLineY = Math.min(numberOfVisibleLines, total)
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  const contentHeight = lines.length * editor.rowHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(editor.height, contentHeight, minimumSliderSize)
  return {
    ...editor,
    lines,
    maxLineY,
    finalY,
    finalDeltaY,
    scrollBarHeight,
  }
}

export * from './EditorRender.js'
