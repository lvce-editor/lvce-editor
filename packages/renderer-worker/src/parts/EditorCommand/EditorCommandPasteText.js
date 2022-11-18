import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const pasteText = (editor, text) => {
  const insertedLines = SplitLines.splitLines(text)
  const changes = editorReplaceSelections(
    editor,
    insertedLines,
    EditOrigin.EditorPasteText
  )
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
