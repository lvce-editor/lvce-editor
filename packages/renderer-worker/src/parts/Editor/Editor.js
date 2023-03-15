import * as Assert from '../Assert/Assert.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as EditorCursor from './EditorCursor.js'
import * as EditorScrolling from './EditorScrolling.js'
import * as EditorSelection from './EditorSelection.js'
import * as EditorText from './EditorText.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'

const MINIMUM_SLIDER_SIZE = 20

// TODO
export const create = (id, uri, languageId, content) => {
  const tokenizer = Tokenizer.getTokenizer(languageId)

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
    tokenizer,
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
    scrollBarHeight: 0,
    undoStack: [],
    // TODO maybe put these into separate tokenization module
    lineCache: [],
    validLines: [],
    invalidStartIndex: 0,
    decorations: [],
    focused: false,
    /**
     * Offset at which scrollbar thumb has been clicked
     */
    handleOffset: 0,
    itemHeight: 20,
    fontFamily: '',
    fontWeight: 400,
    tabSize: 2,
    cursorWidth: 2,
    completionState: EditorCompletionState.None,
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
    /* letterSpacing */ editor.letterSpacing
  )
}

export const renderTextAndCursorAndSelectionsCommands = (editor) => {
  Assert.object(editor)
  const textInfos = EditorText.getVisible(editor)
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  const scrollBarHeight = editor.scrollBarHeight
  const scrollBarY = (editor.deltaY / editor.finalDeltaY) * (editor.height - editor.scrollBarHeight)
  return [
    /* Viewlet.invoke */ 'Viewlet.send',
    /* id */ 'EditorText',
    /* method */ 'renderTextAndCursorsAndSelections',
    /* scrollBarY */ scrollBarY,
    /* scrollBarHeight */ scrollBarHeight,
    /* textInfos */ textInfos,
    /* cursorInfos */ cursorInfos,
    /* selectionInfos */ selectionInfos,
  ]
}

export const renderTextAndCursorAndSelections = (editor) => {
  const commands = renderTextAndCursorAndSelectionsCommands(editor)
  RendererProcess.send(commands)
}

export const setTokenizer = (editor, tokenizer) => {
  editor.tokenizer = Tokenizer.getTokenizer(editor.languageId)
  editor.invalidStartIndex = 0
}

// TODO
export const setDeltaYFixedValue = (editor, value) => {
  return EditorScrolling.setDeltaY(editor, value)
  // renderTextAndCursorAndSelections(editor)
}

export const setDeltaY = (editor, value) => {
  return setDeltaYFixedValue(editor, editor.deltaY + value)
}

export const scheduleSelections = (editor, selectionEdits) => {
  return EditorSelection.setSelections(editor, selectionEdits)
  // const cursorInfos = EditorCursor.getVisible(editor)
  // const selectionInfos = EditorSelection.getVisible(editor)
  // RendererProcess.send([
  //   /* Viewlet.invoke */ 'Viewlet.send',
  //   /* id */ 'EditorText',
  //   /* method */ 'renderCursorsAndSelections',
  //   /* cursorInfos */ cursorInfos,
  //   /* selectionInfos */ selectionInfos,
  // ])
}

export const scheduleSelectionsAndScrollPosition = (editor, selectionEdits, deltaY) => {
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
export const scheduleDocumentAndCursorsSelectionIsUndo = (editor, changes) => {
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
  const newSelections = EditorSelection.applyEdit(partialNewEditor, changes)
  const invalidStartIndex = Math.min(editor.invalidStartIndex, changes[0].start.rowIndex)
  const newEditor = {
    ...partialNewEditor,
    lines: newLines,
    selections: newSelections,
    // undoStack: [...editor.undoStack.slice(0, -2)],
    invalidStartIndex,
  }
  GlobalEventBus.emitEvent('editor.change', newEditor, changes)
  return newEditor
}

export const scheduleDocument = async (editor, changes) => {
  // console.log('before')
  // console.log([...editor.lines])
  const newLines = TextDocument.applyEdits(editor, changes)
  // console.log('after')
  // console.log([...editor.lines])
  const invalidStartIndex = changes[0].start.rowIndex
  // if (editor.undoStack) {
  //   editor.undoStack.push(changes)
  // }
  // const cursorInfos = EditorCursor.getVisible(editor)
  // const selectionInfos = EditorSelection.getVisible(editor)
  // const textInfos = EditorText.getVisible(editor)
  // TODO scrollbar calculation duplicate code
  // const scrollBarY =
  //   (editor.deltaY / editor.finalDeltaY) *
  //   (editor.height - editor.scrollBarHeight)
  // const scrollBarHeight = editor.scrollBarHeight

  const newEditor = {
    ...editor,
    undoStack: [...editor.undoStack, changes],
    lines: newLines,
    invalidStartIndex,
  }
  // TODO change event should be emitted after rendering
  GlobalEventBus.emitEvent('editor.change', editor, changes)
  return newEditor
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

export const hasSelection = (editor) => {
  // TODO editor.selections should always be defined
  return editor.selections && editor.selections.length > 0
}

export const setBounds = (editor, x, y, height, columnWidth) => {
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
  const { itemHeight, numberOfVisibleLines } = editor
  const total = lines.length
  const maxLineY = Math.min(numberOfVisibleLines, total)
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  const contentHeight = lines.length * editor.rowHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(editor.height, contentHeight, MINIMUM_SLIDER_SIZE)
  return {
    ...editor,
    lines,
    maxLineY,
    finalY,
    finalDeltaY,
    scrollBarHeight,
  }
}

const renderLines = {
  isEqual(oldState, newState) {
    return (
      oldState.lines === newState.lines &&
      oldState.tokenizer === newState.tokenizer &&
      oldState.minLineY === newState.minLineY &&
      oldState.decorations === newState.decorations &&
      oldState.embeds === newState.embeds
    )
  },
  apply(oldState, newState) {
    const textInfos = EditorText.getVisible(newState)
    return [/* method */ 'setText', /* textInfos */ textInfos]
  },
}

const renderSelections = {
  isEqual(oldState, newState) {
    return oldState.selections === newState.selections && oldState.focused === newState.focused && oldState.minLineY === newState.minLineY
  },
  apply(oldState, newState) {
    const { cursorInfos, selectionInfos } = EditorSelection.getVisible(newState)
    return [/* method */ 'setSelections', /* cursorInfos */ cursorInfos, /* selectionInfos */ selectionInfos]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(newState.deltaY, newState.finalDeltaY, newState.height, newState.scrollBarHeight)
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    if (!newState.focused) {
      return []
    }
    return [/* method */ 'focus']
  },
}

export const render = [renderLines, renderSelections, renderScrollBar, renderFocus]
