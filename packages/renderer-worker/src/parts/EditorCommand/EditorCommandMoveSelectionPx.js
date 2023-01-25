import * as Assert from '../Assert/Assert.js'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'
import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

const getNewEditor = (editor, position) => {
  const { minLineY, maxLineY, rowHeight } = editor
  const diff = maxLineY - minLineY
  if (position.rowIndex < minLineY) {
    const newMinLineY = position.rowIndex
    const newMaxLineY = position.rowIndex + diff
    const newDeltaY = position.rowIndex * rowHeight
    const anchor = EditorMoveSelectionAnchorState.getPosition()
    const newSelections = new Uint32Array([position.rowIndex - 1, position.columnIndex, anchor.rowIndex, anchor.columnIndex])
    return {
      ...editor,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY: newDeltaY,
      selections: newSelections,
    }
  }
  if (position.rowIndex > maxLineY) {
    const diff = maxLineY - minLineY
    const newMinLineY = position.rowIndex - diff
    const newMaxLineY = position.rowIndex
    const newDeltaY = newMinLineY * rowHeight
    const anchor = EditorMoveSelectionAnchorState.getPosition()
    const newSelections = new Uint32Array([anchor.rowIndex, anchor.columnIndex, position.rowIndex + 1, position.columnIndex])
    return {
      ...editor,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY: newDeltaY,
      selections: newSelections,
    }
  }
  return editor
}

const continueScrollingAndMovingSelection = async () => {
  const editor = EditorSelectionAutoMoveState.getEditor()
  if (!editor) {
    return
  }
  const position = EditorSelectionAutoMoveState.getPosition()
  if (position.rowIndex === 0) {
    return
  }
  const newEditor = getNewEditor(editor, position)
  if (editor === newEditor) {
    return
  }
  await Viewlet.setState('EditorText', newEditor)
  EditorSelectionAutoMoveState.setEditor(newEditor)
  const delta = position.rowIndex < editor.minLineY ? -1 : 1
  EditorSelectionAutoMoveState.setPosition({ rowIndex: position.rowIndex + delta, columnIndex: position.columnIndex })
  RequestAnimationFrame.requestAnimationFrame(continueScrollingAndMovingSelection)
  // TODO get editor state
  // if editor is disposed, return and remove animation frame
  // on cursor up, remove animation frame
  //
}

export const moveSelectionPx = (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  if (!EditorSelectionAutoMoveState.hasListener() && (position.rowIndex < editor.minLineY || position.rowIndex > editor.maxLineY)) {
    RequestAnimationFrame.requestAnimationFrame(continueScrollingAndMovingSelection)
    EditorSelectionAutoMoveState.setEditor(editor)
    EditorSelectionAutoMoveState.setPosition(position)
  }
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
