import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as Editor from '../Editor/Editor.ts'
import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.js'

export const cutLine = async (editor) => {
  const { lines, selections } = editor
  const [startRowIndex] = selections
  const line = lines[startRowIndex]
  const replaceRange = new Uint32Array([startRowIndex, 0, startRowIndex, line.length])
  const changes = EditorCommandReplaceRange.replaceRange(editor, replaceRange, [''], EditOrigin.EditorCut)
  const selectionChanges = new Uint32Array([startRowIndex, 0, startRowIndex, 0])
  await ClipBoard.writeText(line)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
