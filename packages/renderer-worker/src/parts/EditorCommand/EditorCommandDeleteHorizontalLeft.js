import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorDelta from './EditorCommandDelta.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

// TODO optimize this function by profiling and not allocating too many objects
const getChanges = (lines, selections, getDelta) => {
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

const deleteLeftWithAutoClose = (editor) => {
  const { selections, lines } = editor
  for (let i = 0; i < selections.length; i += 4) {
    selections[i + 1]++
    selections[i + 3]++
  }
  const changes = getChanges(lines, selections, EditorDelta.twoCharactersLeft)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorDeleteHorizontalLeft = (editor, getDelta) => {
  const { autoClosingRanges = [], selections, lines } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return deleteLeftWithAutoClose(editor)
  }
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = getChanges(lines, selections, getDelta)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.Delete)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
