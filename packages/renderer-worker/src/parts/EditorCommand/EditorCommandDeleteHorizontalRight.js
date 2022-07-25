import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const isEmpty = (selection) => {
  return selection.start === selection.end
}

export const editorDeleteHorizontalRight = (editor, getDelta) => {
  if (editor.selections.every(isEmpty)) {
    const changes = []
    const lines = editor.lines
    for (const selection of editor.selections) {
      const positionRight = EditorGetPositionRight.editorGetPositionRight(
        selection.start,
        lines,
        getDelta
      )
      changes.push({
        start: selection.start,
        end: positionRight,
        inserted: [''],
        deleted: TextDocument.getSelectionText(editor, {
          start: selection.start,
          end: positionRight,
        }),
        origin: 'deleteHorizontalRight',
      })
    }
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
    const changes = editorReplaceSelections(
      editor,
      [''],
      'deleteHorizontalRight'
    )
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)

}
