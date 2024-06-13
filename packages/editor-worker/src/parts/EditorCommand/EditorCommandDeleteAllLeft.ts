import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const deleteAllLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
