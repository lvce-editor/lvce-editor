// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const typeWithAutoClosingQuote = (editor, text) => {
  const newText = text + text
  const changes = editorReplaceSelections(editor, [newText], EditOrigin.EditorTypeWithAutoClosing)
  const selectionChanges = new Uint32Array([
    // @ts-ignore
    changes[0].start.rowIndex,
    // @ts-ignore
    changes[0].start.columnIndex + 1,
    // @ts-ignore
    changes[0].end.rowIndex,
    // @ts-ignore
    changes[0].end.columnIndex + 1,
  ])
  // @ts-ignore
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
