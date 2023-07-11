import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostCompletion from '../ExtensionHost/ExtensionHostCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
export const getCompletions = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  // Editor.sync(editor)
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const completions = await ExtensionHostCompletion.executeCompletionProvider(editor, offset)
  return completions
}

export const resolveCompletion = async (editor, name) => {
  try {
    Assert.object(editor)
    Assert.string(name)
    const rowIndex = editor.selections[0]
    const columnIndex = editor.selections[1]
    const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
    const resolvedCompletionItem = await ExtensionHostCompletion.executeResolveCompletionItem(editor, offset, name)
    return resolvedCompletionItem
  } catch {
    return undefined
  }
}
