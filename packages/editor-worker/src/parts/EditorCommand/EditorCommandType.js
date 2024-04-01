// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const type = (editor, text) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
