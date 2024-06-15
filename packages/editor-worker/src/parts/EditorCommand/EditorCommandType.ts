import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const type = (editor: any, text: string) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
