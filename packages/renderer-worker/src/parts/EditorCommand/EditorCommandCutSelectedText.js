import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

export const cutSelectedText = async (editor) => {
  const { selections } = editor
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = selections
  const changes = editorReplaceSelections(editor, [''], EditOrigin.EditorCut)
  const selectionChanges = new Uint32Array([startRowIndex, startColumnIndex, endRowIndex, endColumnIndex])
  const text = JoinLines.joinLines(changes[0].deleted)
  // TODO remove selected text from document
  await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ text)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
