import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.js'

export const handlePointerCaptureLost = (editor) => {
  console.log('lost pointer capture')
  EditorSelectionAutoMoveState.clearEditor()
  return editor
}
