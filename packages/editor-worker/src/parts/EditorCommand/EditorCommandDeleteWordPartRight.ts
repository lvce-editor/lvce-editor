import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const deleteWordPartRight = (editor) => {
  EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDelta.wordPartRight)
}
