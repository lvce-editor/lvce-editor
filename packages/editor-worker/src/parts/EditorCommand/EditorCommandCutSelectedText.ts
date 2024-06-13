import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as Editor from '../Editor/Editor.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const cutSelectedText = async (editor) => {
  const { selections } = editor
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = selections
  const changes = editorReplaceSelections(editor, [''], EditOrigin.EditorCut)
  const selectionChanges = new Uint32Array([startRowIndex, startColumnIndex, endRowIndex, endColumnIndex])
  // @ts-ignore
  const text = JoinLines.joinLines(changes[0].deleted)
  // TODO remove selected text from document
  await ClipBoard.writeText(text)
  // @ts-ignore
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
