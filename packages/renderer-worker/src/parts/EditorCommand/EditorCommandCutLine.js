import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'
import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.js'

export const cutLine = async (editor) => {
  const { lines, selections } = editor
  const [startRowIndex] = selections
  const line = lines[startRowIndex]
  const replaceRange = new Uint32Array([startRowIndex, 0, startRowIndex, line.length])
  const changes = EditorCommandReplaceRange.editorReplaceRange(editor, replaceRange, [''], EditOrigin.EditorCut)
  const selectionChanges = new Uint32Array([startRowIndex, 0, startRowIndex, 0])
  await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ line)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
