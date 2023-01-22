import * as Assert from '../Assert/Assert.js'
import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.js'

const moveUpwards = async () => {
  const editor = EditorSelectionAutoMoveState.getEditor()
  if (!editor) {
    return
  }
  const position = EditorSelectionAutoMoveState.getPosition()
  if (position.rowIndex === 0) {
    return
  }
  if (position.rowIndex < editor.minLineY) {
    const diff = editor.maxLineY - editor.minLineY
    const newMinLineY = position.rowIndex
    const newMaxLineY = position.rowIndex + diff
    const newDeltaY = position.rowIndex * editor.rowHeight
    const anchor = EditorMoveSelectionAnchorState.getPosition()
    const newSelections = new Uint32Array([position.rowIndex - 1, position.columnIndex, anchor.rowIndex, anchor.columnIndex])
    console.log({ selections: editor.selections })
    const newEditor = {
      ...editor,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY: newDeltaY,
      selections: newSelections,
    }
    await Viewlet.setState('EditorText', newEditor)
    EditorSelectionAutoMoveState.setEditor(newEditor)
    EditorSelectionAutoMoveState.setPosition({ rowIndex: position.rowIndex - 1, columnIndex: position.columnIndex })
    RequestAnimationFrame.requestAnimationFrame(moveUpwards)
  }
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
  if (position.rowIndex < editor.minLineY && !EditorSelectionAutoMoveState.hasListener()) {
    RequestAnimationFrame.requestAnimationFrame(moveUpwards)
    EditorSelectionAutoMoveState.setEditor(editor)
    EditorSelectionAutoMoveState.setPosition(position)
  }
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
