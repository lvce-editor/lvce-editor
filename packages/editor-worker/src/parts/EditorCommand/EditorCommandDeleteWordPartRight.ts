import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const deleteWordPartRight = (editor: any) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDelta.wordPartRight)
}
