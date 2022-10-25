import * as ExtensionHostCompletion from '../ExtensionHost/ExtensionHostCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
export const getCompletions = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  // Editor.sync(editor)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const completions = await ExtensionHostCompletion.executeCompletionProvider(
    editor,
    offset
  )
  return completions
}
