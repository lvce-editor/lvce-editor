import * as ExtensionHostTabCompletion from '../ExtensionHost/ExtensionHostTabCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const getTabCompletion = async (editor) => {
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
