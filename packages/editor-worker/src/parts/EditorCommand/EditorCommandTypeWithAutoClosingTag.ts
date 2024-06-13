// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
// @ts-ignore
import * as ExtensionHostClosingTag from '../ExtensionHost/ExtensionHostClosingTagCompletion.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

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
