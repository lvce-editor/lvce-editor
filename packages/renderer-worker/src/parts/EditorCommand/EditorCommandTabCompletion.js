import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionHostTabCompletion from '../ExtensionHost/ExtensionHostTabCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorSnippet from './EditorCommandSnippet.js'

const getTabCompletion = async (editor) => {
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  const tabCompletion =
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      editor,
      offset
    )
  return tabCompletion
}

export const editorTabCompletion = async (editor) => {
  // TODO race condition
  // TODO get tab completion for each cursor
  const tabCompletion = await getTabCompletion(editor)
  if (!tabCompletion) {
    return editor
  }
  return EditorSnippet.editorSnippet(editor, tabCompletion)
}
