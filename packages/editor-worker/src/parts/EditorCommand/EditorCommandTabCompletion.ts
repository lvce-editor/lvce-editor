import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
// @ts-ignore
import * as TabCompletion from '../TabCompletion/TabCompletion.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'
import * as EditorSnippet from './EditorCommandSnippet.ts'

// @ts-ignore
const getErrorMessage = (error) => {
  return `${error}`
}

// @ts-ignore
export const tabCompletion = async (editor) => {
  try {
    // TODO race condition
    // TODO get tab completion for each cursor
    const tabCompletion = await TabCompletion.getTabCompletion(editor)
    if (!tabCompletion) {
      return editor
    }
    return EditorSnippet.editorSnippet(editor, tabCompletion)
  } catch (error) {
    await ErrorHandling.handleError(error)
    // TODO cursor should always be of type object
    const rowIndex = editor.selections[0]
    const columnIndex = editor.selections[1]
    return EditorShowMessage.showErrorMessage(editor, rowIndex, columnIndex, getErrorMessage(error))
  }
}