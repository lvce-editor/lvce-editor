// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const getChanges = (editor, getDelta) => {
  const selections = editor.selections
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = []
    const lines = editor.lines
    for (let i = 0; i < selections.length; i += 4) {
      // @ts-ignore
      const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
      const start = {
        rowIndex: selectionStartRow,
        columnIndex: selectionStartColumn,
      }
      const positionRight = EditorGetPositionRight.editorGetPositionRight(start, lines, getDelta)
      changes.push({
        start: start,
        end: positionRight,
        inserted: [''],
        deleted: TextDocument.getSelectionText(editor, {
          start: start,
          end: positionRight,
        }),
        origin: EditOrigin.DeleteHorizontalRight,
      })
    }
    return changes
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.DeleteHorizontalRight)
  return changes
}

export const editorDeleteHorizontalRight = (editor, getDelta) => {
  const changes = getChanges(editor, getDelta)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
