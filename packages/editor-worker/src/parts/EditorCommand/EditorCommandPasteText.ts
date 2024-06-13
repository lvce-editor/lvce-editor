// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const pasteText = (editor, text) => {
  const insertedLines = SplitLines.splitLines(text)
  const changes = editorReplaceSelections(editor, insertedLines, EditOrigin.EditorPasteText)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
