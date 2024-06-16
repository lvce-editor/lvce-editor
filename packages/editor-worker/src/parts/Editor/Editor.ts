import * as Assert from '../Assert/Assert.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorScrolling from './EditorScrolling.ts'
import * as EditorSelection from './EditorSelection.ts'

// @ts-ignore
export const create = (id, uri, languageId, content) => {}

// @ts-ignore
export const dispose = (id) => {
  // delete state.editors[id]
}

// TODO
// @ts-ignore
export const setDeltaYFixedValue = (editor, value) => {
  return EditorScrolling.setDeltaY(editor, value)
}

// @ts-ignore
export const setDeltaY = (editor, value) => {
  return setDeltaYFixedValue(editor, editor.deltaY + value)
}

// @ts-ignore
const isAutoClosingChange = (change) => {
  return change.origin === EditOrigin.EditorTypeWithAutoClosing
}

// @ts-ignore
const applyAutoClosingRangesEdit = (editor, changes) => {
  const { autoClosingRanges = [] } = editor
  const newAutoClosingRanges: any[] = []
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

export const scheduleSelections = (editor: any, selectionEdits: any) => {
  return EditorSelection.setSelections(editor, selectionEdits)
}

/**
 *
 * @param {any} editor
 * @param {any[]} changes
 * @param {Uint32Array|undefined} selectionChanges
 * @returns
 */
// @ts-ignore
export const scheduleDocumentAndCursorsSelections = (editor: any, changes: any, selectionChanges: any = undefined) => {
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
  return newEditor
}
// @ts-ignore
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
  return newEditor
}

// @ts-ignore
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

// @ts-ignore
export const hasSelection = (editor) => {
  // TODO editor.selections should always be defined
  return editor.selections && editor.selections.length > 0
}

// @ts-ignore
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
