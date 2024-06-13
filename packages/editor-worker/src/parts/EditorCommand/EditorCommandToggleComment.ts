import * as Logger from '../Logger/Logger.ts'
import * as EditorToggleBlockComment from './EditorCommandToggleBlockComment.ts'
import * as EditorToggleLineComment from './EditorCommandToggleLineComment.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

// TODO rename file
// TODO when handle case when editor has selection
// @ts-ignore
export const toggleComment = async (editor) => {
  try {
    const newEditor = await EditorToggleLineComment.editorToggleLineComment(editor)
    if (editor !== newEditor) {
      return newEditor
    }
    return EditorToggleBlockComment.toggleBlockComment(editor)
  } catch (error) {
    Logger.error(error)
    // TODO use correct position
    await EditorShowMessage.editorShowMessage(
      /* editor */ editor,
      /* rowIndex */ 0,
      /* columnIndex */ 0,
      /* message */ `${error}`,
      /* isError */ true,
    )
    return editor
  }
}
