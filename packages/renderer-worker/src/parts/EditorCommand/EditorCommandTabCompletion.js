import * as ExtensionHostTabCompletion from '../ExtensionHost/ExtensionHostTabCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorSnippet from './EditorCommandSnippet.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

const getTabCompletion = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const tabCompletion =
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      editor,
      offset
    )
  return tabCompletion
}

const getErrorMessage = (error) => {
  return `${error}`
}

export const editorTabCompletion = async (editor) => {
  try {
    // TODO race condition
    // TODO get tab completion for each cursor
    const tabCompletion = await getTabCompletion(editor)
    if (!tabCompletion) {
      console.log({ tabCompletion })
      return editor
    }
    return EditorSnippet.editorSnippet(editor, tabCompletion)
  } catch (error) {
    console.error(error)
    // TODO cursor should always be of type object
    const position = {
      rowIndex: editor.selections[0],
      columnIndex: editor.selections[1],
    }
    return EditorShowMessage.showErrorMessage(
      editor,
      position,
      getErrorMessage(error)
    )
  }
}
