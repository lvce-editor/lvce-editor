import * as Editor from '../Editor/Editor.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const editorPasteText = (editor, text) => {
  const insertedLines = text.split('\n')
  const changes = editorReplaceSelections(
    editor,
    insertedLines,
    'editorPasteText'
  )
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
