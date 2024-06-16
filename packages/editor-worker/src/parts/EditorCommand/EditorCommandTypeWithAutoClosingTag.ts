import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const typeWithAutoClosingTag = async (editor: any, text: string) => {
  const offset = TextDocument.offsetAt(editor, editor.selections[0], editor.selections[1])
  const result = await RendererWorker.invoke('ExtensionHostClosingTagCompletion.executeClosingTagProvider', editor, offset, text)
  if (result === undefined) {
    const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [result.inserted], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
