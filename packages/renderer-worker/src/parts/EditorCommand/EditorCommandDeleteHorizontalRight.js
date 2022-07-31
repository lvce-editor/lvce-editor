import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const getChanges = (editor, getDelta) => {
  const selections = editor.selections
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = []
    const lines = editor.lines
    for (let i = 0; i < selections.length; i += 4) {
      const selectionStartRow = selections[i]
      const selectionStartColumn = selections[i + 1]
      const selectionEndRow = selections[i + 2]
      const selectionEndColumn = selections[i + 3]
      const start = {
        rowIndex: selectionStartRow,
        columnIndex: selectionStartColumn,
      }
      const positionRight = EditorGetPositionRight.editorGetPositionRight(
        start,
        lines,
        getDelta
      )
      changes.push({
        start: start,
        end: positionRight,
        inserted: [''],
        deleted: TextDocument.getSelectionText(editor, {
          start: start,
          end: positionRight,
        }),
        origin: 'deleteHorizontalRight',
      })
    }
    return changes
  }
  const changes = editorReplaceSelections(editor, [''], 'deleteHorizontalRight')
  return changes
}

export const editorDeleteHorizontalRight = (editor, getDelta) => {
  const changes = getChanges(editor, getDelta)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
