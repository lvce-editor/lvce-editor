import * as ExtensionHostTabCompletion from '../ExtensionHost/ExtensionHostTabCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorSnippet from './EditorCommandSnippet.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorShowMessage from './EditorCommandShowMessage.js'

const getTabCompletion = async (editor) => {
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const tabCompletion =
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      editor,
      offset
    )
  console.log({ tabCompletion })
  Assert.object(tabCompletion)
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
    // TODO cursor should always be of type object
    const position = Array.isArray(editor.cursor)
      ? editor.cursor[0]
      : editor.cursor
    return EditorShowMessage.showErrorMessage(
      editor,
      position,
      getErrorMessage(error)
    )
  }
}
