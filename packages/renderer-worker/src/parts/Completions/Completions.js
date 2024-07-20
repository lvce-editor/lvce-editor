import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCompletion from '../ExtensionHost/ExtensionHostCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
export const getCompletions = async (editor) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  // Editor.sync(editor)
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const completions = await ExtensionHostCompletion.executeCompletionProvider(editor, offset)
  return completions
}

// TODO don't send unnecessary parts of completion item like matches
export const resolveCompletion = async (editor, name, completionItem) => {
  try {
    Assert.object(editor)
    Assert.string(name)
    Assert.object(completionItem)
    const rowIndex = editor.selections[0]
    const columnIndex = editor.selections[1]
    const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
    const resolvedCompletionItem = await ExtensionHostCompletion.executeResolveCompletionItem(editor, offset, name, completionItem)
    return resolvedCompletionItem
  } catch {
    return undefined
  }
}
