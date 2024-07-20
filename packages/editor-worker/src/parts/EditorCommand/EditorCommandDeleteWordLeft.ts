import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const deleteWordLeft = (editor: any) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.wordLeft)
  return newEditor
}
