import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'

// TODO optimize this function by profiling and not allocating too many objects
const getChanges = (lines, selections, getDelta) => {
  const changes = []
  const deleteSelection = (
    selectionStartRow,
    selectionStartColumn,
    selectionEndRow,
    selectionEndColumn
  ) => {
    const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(
      selectionStartRow,
      selectionStartColumn,
      lines,
      getDelta
    )
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

export const editorDeleteHorizontalLeft = (editor, getDelta) => {
  const lines = editor.lines
  const selections = editor.selections
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = getChanges(lines, selections, getDelta)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.Delete)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
