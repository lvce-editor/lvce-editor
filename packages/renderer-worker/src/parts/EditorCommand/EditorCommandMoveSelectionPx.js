import * as Assert from '../Assert/Assert.js'
import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.js'
import * as EditorMoveSelection from './EditorCommandMoveSelection.js'
import * as EditorPosition from './EditorCommandPosition.js'

const moveUpwards = () => {
  const editor = EditorSelectionAutoMoveState.getEditor()
  if (!editor) {
    return
  }
  const position = EditorSelectionAutoMoveState.getPosition()
  if (position.rowIndex < editor.minLineY) {
    console.log('move upwards')
  }
  // TODO get editor state
  // if editor is disposed, return and remove animation frame
  // on cursor up, remove animation frame
  //
  RequestAnimationFrame.requestAnimationFrame(moveUpwards)
}

export const moveSelectionPx = (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  if (position.rowIndex < editor.minLineY && !EditorSelectionAutoMoveState.hasListener()) {
    const animationFrameId = RequestAnimationFrame.requestAnimationFrame(moveUpwards)
    EditorSelectionAutoMoveState.setEditor(editor)
    console.log({ position })
  }
  return EditorMoveSelection.editorMoveSelection(editor, position)
}
