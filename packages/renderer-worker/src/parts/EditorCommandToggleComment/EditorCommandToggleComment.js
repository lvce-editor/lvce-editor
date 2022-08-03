import * as EditorToggleBlockComment from '../EditorCommandToggleBlockComment/EditorCommandToggleBlockComment.js'
import * as EditorToggleLineComment from '../EditorCommandToggleLineComment/EditorCommandToggleLineComment.js'

// TODO rename file
// TODO when handle case when editor has selection
export const editorToggleComment = async (editor) => {
  const newEditor = await EditorToggleLineComment.editorToggleLineComment(
    editor
  )
  if (editor !== newEditor) {
    return newEditor
  }
  return EditorToggleBlockComment.editorToggleBlockComment(editor)
}
