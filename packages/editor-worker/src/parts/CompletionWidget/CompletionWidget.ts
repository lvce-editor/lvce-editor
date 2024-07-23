import * as Completions from '../Completions/Completions.ts'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'
import * as EditorShowMessage from '../EditorCommand/EditorCommandShowMessage.ts'
import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.ts'
import * as GetFinalDeltaY from '../GetFinalDeltaY/GetFinalDeltaY.ts'
import * as GetListHeight from '../GetListHeight/GetListHeight.ts'

const getEditor = (uid: number): any => {
  const editor = {}
  return editor
}

const getDisplayErrorMessage = (error: any) => {
  const message = `${error}`
  const errorPrefix = 'Error: '
  if (message.startsWith(errorPrefix)) {
    return message.slice(errorPrefix.length)
  }
  return message
}

const RE_WORD = /[\w\-]+$/

// TODO use textdocument
const getWordAtOffset = (editor: any) => {
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

export const handleEditorType = (state: any) => {
  const { editorUid } = state
  const editor = getEditor(editorUid)
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

export const handleEditorDeleteLeft = (state: any) => {
  const { editorUid } = state
  const editor = getEditor(editorUid)
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

export const loadContent = async (itemHeight: number, maxHeight: number, editorUid: number) => {
  const editor = getEditor(editorUid)
  const unfilteredItems = await Completions.getCompletions(editor)
  const wordAtOffset = getWordAtOffset(editor)
  const items = FilterCompletionItems.filterCompletionItems(unfilteredItems, wordAtOffset)
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  const newMaxLineY = Math.min(items.length, 8)
  editor.widgets = editor.widgets || []
  // editor.widgets.push(ViewletModuleId.EditorCompletion)
  const itemsLength = items.length
  const newFocusedIndex = itemsLength === 0 ? -1 : 0
  const total = items.length
  const height = GetListHeight.getListHeight(items.length, itemHeight, maxHeight)
  const finalDeltaY = GetFinalDeltaY.getFinalDeltaY(height, itemHeight, total)
  return {
    unfilteredItems,
    items,
    x,
    y,
    maxLineY: newMaxLineY,
    focusedIndex: newFocusedIndex,
    finalDeltaY,
    leadingWord: wordAtOffset,
    height,
    rowIndex,
    columnIndex,
  }
}

export const handleError = async (error: any) => {
  const displayErrorMessage = getDisplayErrorMessage(error)
  const editor = getEditor(-1)
  await EditorShowMessage.editorShowMessage(
    /* editor */ editor,
    /* rowIndex */ 0,
    /* columnIndex */ 0,
    /* message */ displayErrorMessage,
    /* isError */ true,
  )
}

export const loadingContent = () => {
  const editor = getEditor(-1)
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  // const x = EditorPosition.x(editor, rowIndex, columnIndex)
  // @ts-ignore
  const y = EditorPosition.y(editor, rowIndex, columnIndex)
  // const changes = [/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.EditorCompletion, /* method */ 'showLoading', /* x */ x, /* y */ y]
  return []
}
