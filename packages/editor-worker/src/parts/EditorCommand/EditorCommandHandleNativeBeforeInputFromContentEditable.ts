// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as EditorGetSelectionFromNativeRange from './EditorCommandGetSelectionFromNativeRange.ts'

// @ts-ignore
const getChanges = (editor, data, range) => {
  const selection = EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
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
      origin: EditOrigin.ContentEditableInput,
    },
  ]
  return changes
}

// @ts-ignore
export const handleBeforeInputFromContentEditable = (editor, data, range) => {
  const changes = getChanges(editor, data, range)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}