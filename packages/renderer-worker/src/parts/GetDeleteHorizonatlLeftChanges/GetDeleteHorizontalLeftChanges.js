import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as EditorGetPositionLeft from '../EditorCommand/EditorCommandGetPositionLeft.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO optimize this function by profiling and not allocating too many objects
export const getChanges = (lines, selections, getDelta) => {
  const changes = []
  const deleteSelection = (selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) => {
    const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(selectionStartRow, selectionStartColumn, lines, getDelta)
    const selectionEnd = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    changes.push({
      start: positionLeft,
      end: selectionEnd,
      inserted: [''],
      deleted: TextDocument.getSelectionText(
        { lines },
        {
          start: positionLeft,
          end: selectionEnd,
        }
      ),
      origin: EditOrigin.Delete,
    })
  }
  EditorSelection.forEach(selections, deleteSelection)
  return changes
}
