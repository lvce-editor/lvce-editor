import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetSelectionFromNativeRange from './EditorCommandGetSelectionFromNativeRange.js'

const getChanges = (editor, data, range) => {
  const selection =
    EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  const changes = [
    {
      start: selection.start,
      end: selection.end,
      inserted: [data],
      deleted: TextDocument.getSelectionText(editor, selection),
      origin: 'contentEditableInput',
    },
  ]
  return changes
}

export const handleBeforeInputFromContentEditable = (editor, data, range) => {
  const changes = getChanges(editor, data, range)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
