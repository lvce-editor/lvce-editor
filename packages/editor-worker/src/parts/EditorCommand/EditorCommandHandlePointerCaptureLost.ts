import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'

export const handlePointerCaptureLost = (editor) => {
  EditorSelectionAutoMoveState.clearEditor()
  return editor
}
