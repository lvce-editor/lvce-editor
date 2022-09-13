import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetSelectionFromNativeRange from './ViewletEditorGetSelectionFromNativeRange.js/index.js'

const getChanges = (editor, data, range) => {
  const selection =
    EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  const selectionRange = {
    start: {
      rowIndex: selection[0],
      columnIndex: selection[1],
    },
    end: {
      rowIndex: selection[2],
      columnIndex: selection[3],
    },
  }
  const changes = [
    {
      start: selectionRange.start,
      end: selectionRange.end,
      inserted: [data],
      deleted: TextDocument.getSelectionText(editor, selectionRange),
      origin: 'contentEditableInput',
    },
  ]
  return changes
}

export const handleBeforeInputFromContentEditable = (editor, data, range) => {
  const changes = getChanges(editor, data, range)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
