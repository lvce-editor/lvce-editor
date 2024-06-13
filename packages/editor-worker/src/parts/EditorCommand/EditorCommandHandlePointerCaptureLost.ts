import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'

// @ts-ignore
export const handlePointerCaptureLost = (editor) => {
  EditorSelectionAutoMoveState.clearEditor()
  return editor
}
