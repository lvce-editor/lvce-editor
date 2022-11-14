import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as TabCompletion from '../TabCompletion/TabCompletion.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'
import * as EditorSnippet from './EditorCommandSnippet.js'

const getErrorMessage = (error) => {
  return `${error}`
}

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
    ErrorHandling.printError(error)
    // TODO cursor should always be of type object
    const rowIndex = editor.selections[0]
    const columnIndex = editor.selections[1]
    return EditorShowMessage.showErrorMessage(
      editor,
      rowIndex,
      columnIndex,
      getErrorMessage(error)
    )
  }
}
