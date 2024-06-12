import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js'

export const handlePointerCaptureLost = (editor) => {
  EditorSelectionAutoMoveState.clearEditor()
  return editor
}
