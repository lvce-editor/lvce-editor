import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Assert from '../Assert/Assert.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as EditorCursor from './EditorCursor.js'
import * as EditorScrolling from './EditorScrolling.js'
import * as EditorSelection from './EditorSelection.js'
import * as EditorText from './EditorText.js'

const MINIMUM_SLIDER_SIZE = 20

// TODO
export const create = (id, uri, languageId, content) => {
  const tokenizer = Tokenizer.getTokenizer(languageId)

  // TODO flatten structure
  return {
    uri,
    languageId,
    lines: content.split('\n'),
    // TODO cursor should be part of selection,
    // codemirror has selections: Selection[]
    //            selectionIndex: number
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    // TODO how to get the trigger characters here from extension host
    completionTriggerCharacters: [],
    selections: new Uint32Array(),
    id,
    tokenizer,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    numberOfVisibleLines: 0,
    finalY: 0,
    finalDeltaY: 0,
    height: 0,
    top: 0,
    left: 0,
    columnWidth: 0,
    rowHeight: 0,
    fontSize: 0, // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
    letterSpacing: 0,
    scrollBarHeight: 0,
    undoStack: [],
    // TODO maybe put these into separate tokenization module
    lineCache: [],
    validLines: [],
    invalidStartIndex: 0,
    decorations: [],
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
  const cursorInfos = EditorCursor.getVisible(editor)
  const selectionInfos = EditorSelection.getVisible(editor)
  const scrollBarHeight = editor.scrollBarHeight
  const scrollBarY =
    (editor.deltaY / editor.finalDeltaY) *
    (editor.height - editor.scrollBarHeight)
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

export const scheduleSelectionsAndScrollPosition = (
  editor,
  selectionEdits,
  deltaY
) => {
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

export const scheduleDocumentAndCursorsSelections = (editor, changes) => {
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
  console.log({ partialNewEditor })
  const newSelections = EditorSelection.applyEdit(partialNewEditor, changes)
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  const invalidStartIndex = Math.min(
    editor.invalidStartIndex,
    changes[0].start.rowIndex
  )

  // TODO maybe put undostack into indexeddb so that there is no memory leak in application
  // then clear old undostack from indexeddb after 3 days
  // TODO should push to undostack after rendering

  const newEditor = {
    ...partialNewEditor,
    lines: newLines,
    selections: newSelections,
    cursor: newSelections[0].end,
    undoStack: [...editor.undoStack, changes],
    invalidStartIndex,
  }
  GlobalEventBus.emitEvent('editor.change', newEditor, changes)

  return newEditor
  // const textInfos = EditorText.getVisible(editor)
  // const cursorInfos = EditorCursor.getVisible(editor)
  // const selectionInfos = EditorSelection.getVisible(editor)

  // if (editor.undoStack) {
  //   editor.undoStack.push(changes)
  // }
  // RendererProcess.send([
  //   /* Viewlet.invoke */ 'Viewlet.send',
  //   /* id */ 'EditorText',
  //   /* method */ 'renderTextAndCursorsAndSelections',
  //   /* deltaY */ editor.deltaY,
  //   /* scrollBarHeight */ editor.scrollBarHeight,
  //   /* textInfos */ textInfos,
  //   /* cursorInfos */ cursorInfos,
  //   /* selectionInfos */ selectionInfos,
  // ])
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

export const setBounds = (editor, top, left, height, columnWidth) => {
  const numberOfVisibleLines = Math.floor(height / 20)
  const maxLineY = Math.min(numberOfVisibleLines, editor.lines.length)
  const finalY = Math.max(editor.lines.length - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * 20
  return {
    ...editor,
    top,
    left,
    height,
    columnWidth,
    numberOfVisibleLines,
    maxLineY,
    finalY,
    finalDeltaY,
  }
}

const getScrollBarHeight = (editorHeight, contentHeight) => {
  if (editorHeight > contentHeight) {
    return 0
  }
  return Math.max(
    Math.round(editorHeight ** 2 / contentHeight),
    MINIMUM_SLIDER_SIZE
  )
}

export const setText = (editor, text) => {
  const lines = text.split('\n')
  const maxLineY = Math.min(editor.numberOfVisibleLines, lines.length)
  const finalY = Math.max(lines.length - editor.numberOfVisibleLines, 0)
  const finalDeltaY = finalY * 20
  const contentHeight = lines.length * editor.rowHeight
  const scrollBarHeight = getScrollBarHeight(editor.height, contentHeight)
  return {
    ...editor,
    lines,
    maxLineY,
    finalY,
    finalDeltaY,
    scrollBarHeight,
  }
}

export const render = (oldState, newState) => {
  const changes = []
  if (
    oldState.lines !== newState.lines ||
    oldState.tokenizer !== newState.tokenizer ||
    oldState.minLineY !== newState.minLineY ||
    oldState.decorations !== newState.decorations
  ) {
    const textInfos = EditorText.getVisible(newState)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorText',
      /* method */ 'setText',
      /* textInfos */ textInfos,
    ])
  }

  if (oldState.selections !== newState.selections) {
    const cursorInfos = EditorCursor.getVisible(newState)
    const selectionInfos = EditorSelection.getVisible(newState)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorText',
      /* method */ 'setSelections',
      /* cursorInfos */ cursorInfos,
      /* selectionInfos */ selectionInfos,
    ])
  }
  if (
    oldState.deltaY !== newState.deltaY ||
    oldState.scrollBarHeight !== newState.scrollBarHeight
  ) {
    const scrollBarY =
      (newState.deltaY / newState.finalDeltaY) *
      (newState.height - newState.scrollBarHeight)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'EditorText',
      /* method */ 'setScrollBar',
      /* scrollBarY */ scrollBarY,
      /* scrollBarHeight */ newState.scrollBarHeight,
    ])
  }

  return changes
}
