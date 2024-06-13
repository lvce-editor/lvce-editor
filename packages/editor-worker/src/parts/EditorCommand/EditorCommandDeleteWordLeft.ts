import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const deleteWordLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.wordLeft)
  return {
    newState: newEditor,
    commands: [],
  }
}
