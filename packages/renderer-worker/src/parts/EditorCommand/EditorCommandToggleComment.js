import * as EditorToggleBlockComment from './EditorCommandToggleBlockComment.js'
import * as EditorToggleLineComment from './EditorCommandToggleLineComment.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'
// TODO rename file
// TODO when handle case when editor has selection
export const editorToggleComment = async (editor) => {
  try {
    const newEditor = await EditorToggleLineComment.editorToggleLineComment(
      editor
    )
    if (editor !== newEditor) {
      return newEditor
    }
    return EditorToggleBlockComment.editorToggleBlockComment(editor)
  } catch (error) {
    console.error(error)
    // TODO use correct position
    await EditorShowMessage.editorShowMessage(
      /* editor */ editor,
      /* rowIndex */ 0,
      /* columnIndex */ 0,
      /* message */ `${error}`,
      /* isError */ true
    )
    return editor
  }
}
