import * as Completions from '../Completions/Completions.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.js'
import * as GetFinalDeltaY from '../GetFinalDeltaY/GetFinalDeltaY.js'
import * as Height from '../Height/Height.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as VirtualList from '../VirtualList/VirtualList.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    isOpened: false,
    openingReason: 0,
    editor: undefined,
    rowIndex: 0,
    columnIndex: 0,
    leadingWord: '',
    loadingTimeout: -1,
    unfilteredItems: [],
    x: 0,
    y: 0,
    width: 250,
    height: 150,
    ...VirtualList.create({
      headerHeight: 0,
      itemHeight: Height.CompletionItem,
      minimumSliderSize: Height.MinimumSliderSize,
    }),
  }
}

const getEditor = () => {
  return Viewlet.getState(ViewletModuleId.EditorText)
}

const getDisplayErrorMessage = (error) => {
  const message = `${error}`
  const errorPrefix = 'Error: '
  if (message.startsWith(errorPrefix)) {
    return message.slice(errorPrefix.length)
  }
  return message
}

const RE_WORD = /[\w\-]+$/

const getWordAtOffset = (editor) => {
  const { lines, selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const line = lines[rowIndex]
  const part = line.slice(0, columnIndex)
  const wordMatch = part.match(RE_WORD)
  if (wordMatch) {
    return wordMatch[0]
  }
  return ''
}

export const handleEditorType = (state, editor, text) => {
  const { unfilteredItems } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMaxLineY = Math.min(items.length, 8)
  return {
    ...state,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
  }
}

export const handleEditorDeleteCharacterLeft = (state, editor) => {
  const { unfilteredItems } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const wordAtOffset = getWordAtOffset(editor)
  if (!wordAtOffset) {
    editor.completionState = EditorCompletionState.None
    return {
      ...state,
      disposed: true,
    }
  }
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMaxLineY = Math.min(items.length, 8)
  return {
    ...state,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

const disposeWithEditor = (state, editor) => {
  editor.completionState = EditorCompletionState.None
  return dispose(state)
}

export const handleEditorClick = disposeWithEditor

export const handleEditorBlur = disposeWithEditor

export const loadContent = async (state) => {
  const { height, itemHeight } = state
  const editor = getEditor()
  const unfilteredItems = await Completions.getCompletions(editor)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const newMaxLineY = Math.min(items.length, 8)
  editor.widgets = editor.widgets || []
  editor.widgets.push(ViewletModuleId.EditorCompletion)
  const itemsLength = items.length
  const newFocusedIndex = itemsLength === 0 ? -1 : 0
  const total = items.length
  const finalDeltaY = GetFinalDeltaY.getFinalDeltaY(height, itemHeight, total)
  return {
    ...state,
    unfilteredItems,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
    focusedIndex: newFocusedIndex,
    finalDeltaY,
  }
}

export const handleError = async (error) => {
  const displayErrorMessage = getDisplayErrorMessage(error)
  const editor = getEditor()
  await EditorShowMessage.editorShowMessage(
    /* editor */ editor,
    /* rowIndex */ 0,
    /* columnIndex */ 0,
    /* message */ displayErrorMessage,
    /* isError */ true
  )
}

export const loadingContent = () => {
  const editor = getEditor()
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const changes = [/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.EditorCompletion, /* method */ 'showLoading', /* x */ x, /* y */ y]
  return changes
}

export const handleSelectionChange = (state, selectionChanges) => {}

export const advance = (state, word) => {
  const filteredItems = FilterCompletionItems.filterCompletionItems(state.items, word)
  return {
    ...state,
    filteredItems,
  }
}
export * from '../VirtualList/VirtualList.js'
