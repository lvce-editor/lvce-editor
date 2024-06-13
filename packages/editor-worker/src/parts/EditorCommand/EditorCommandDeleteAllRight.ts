import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const deleteAllRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDelta.lineEnd)
}
