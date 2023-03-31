// import * as EditorCompletion from '../EditorCompletion/EditorCompletion.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const typeWithAutoClosingTag = async (editor, text) => {
  const offset = TextDocument.offsetAt(editor, editor.selections[0], editor.selections[1])
  const result = await ExtensionHostClosingTag.executeClosingTagProvider(editor, offset, text)
  if (result === undefined) {
    const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [result.inserted], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
