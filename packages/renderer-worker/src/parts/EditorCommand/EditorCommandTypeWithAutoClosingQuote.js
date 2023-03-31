import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const typeWithAutoClosingQuote = (editor, text) => {
  const newText = text + text
  const changes = editorReplaceSelections(editor, [newText], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array([
    changes[0].start.rowIndex,
    changes[0].start.columnIndex + 1,
    changes[0].end.rowIndex,
    changes[0].end.columnIndex + 1,
  ])
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
