import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'

const isEmpty = (selection) => {
  return selection.start === selection.end
}

export const editorDeleteHorizontalLeft = (editor, getDelta) => {
  if (editor.selections.every(isEmpty)) {
    const changes = []
    const lines = editor.lines
    for (const selection of editor.selections) {
      const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(
        selection.start,
        lines,
        getDelta
      )
      changes.push({
        start: positionLeft,
        end: selection.end,
        inserted: [''],
        deleted: TextDocument.getSelectionText(editor, {
          start: positionLeft,
          end: selection.end,
        }),
        origin: 'delete',
      })
    }
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
    const changes = editorReplaceSelections(editor, [''], 'delete')
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)

}
