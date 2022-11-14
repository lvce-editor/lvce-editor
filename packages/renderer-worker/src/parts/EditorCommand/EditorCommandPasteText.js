import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const pasteText = (editor, text) => {
  const insertedLines = text.split('\n')
  const changes = editorReplaceSelections(
    editor,
    insertedLines,
    EditOrigin.EditorPasteText
  )
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
