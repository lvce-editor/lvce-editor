import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.js'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetListHeight from '../GetListHeight/GetListHeight.js'
import * as Height from '../Height/Height.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as VirtualList from '../VirtualList/VirtualList.js'

export const create = (id, uri, x, y, width, height) => {
  Focus.setAdditionalFocus(FocusKey.EditorCompletion)
  return {
    uid: id,
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
      minimumSliderSize: MinimumSliderSize.minimumSliderSize,
    }),
    maxHeight: 150,
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
  const { unfilteredItems, itemHeight, maxHeight } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const newMinLineY = 0
  const newMaxLineY = Math.min(items.length, 8)
  const height = GetListHeight.getListHeight(items.length, itemHeight, maxHeight)
  const finalDeltaY = items.length * itemHeight - height
  return {
    ...state,
    items,
    x,
    y,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    leadingWord: wordAtOffset,
    height,
    finalDeltaY,
  }
}

export const handleEditorDeleteLeft = (state, editor) => {
  const { unfilteredItems, itemHeight, maxHeight } = state
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
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
  const height = GetListHeight.getListHeight(items.length, itemHeight, maxHeight)
  return {
    ...state,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
    leadingWord: wordAtOffset,
    height,
  }
}

export const dispose = (state) => {
  Focus.removeAdditionalFocus(FocusKey.EditorCompletion)
  return {
    ...state,
    disposed: true,
  }
}

const disposeWithEditor = (state, editor) => {
  editor.completionState = EditorCompletionState.None
  editor.completionUid = 0
  Focus.removeAdditionalFocus(FocusKey.EditorCompletion)
  return dispose(state)
}

export const handleEditorClick = disposeWithEditor

export const handleEditorBlur = disposeWithEditor

export const loadContent = async (state) => {
  const editor = getEditor()
  const editorUid = editor.uid
  return EditorWorker.invoke('EditorCompletion.loadContent', editorUid, state)
}

export const handleError = async (error) => {
  const displayErrorMessage = getDisplayErrorMessage(error)
  const editor = getEditor()
  await EditorShowMessage.editorShowMessage(
    /* editor */ editor,
    /* rowIndex */ 0,
    /* columnIndex */ 0,
    /* message */ displayErrorMessage,
    /* isError */ true,
  )
}

export const loadingContent = () => {
  const editor = getEditor()
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
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
