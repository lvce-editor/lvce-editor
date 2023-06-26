import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as Rename from '../Rename/Rename.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

// TODO memory leak
export const state = {
  editor: undefined,
}

const rename = (editor, rowIndex, columnIndex, newName) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  return Rename.rename(editor, offset, newName)
}

export const open = async (editor) => {
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  await Viewlet.openWidget(ViewletModuleId.EditorRename)
}

const toPositionBasedEdits = (textDocument, edits) => {
  const positionBasedEdits = []
  for (const edit of edits) {
    const start = TextDocument.positionAt(textDocument, edit.offset)
    const end = TextDocument.positionAt(textDocument, edit.offset + edit.inserted.length - edit.deleted)
    positionBasedEdits.push({
      start,
      end,
      inserted: SplitLines.splitLines(edit.inserted),
      deleted: [''],
    })
    console.log(edit)
  }
  return positionBasedEdits
}

// TODO how to best apply workspace edit?
const applyWorkspaceEdits = async (editor, workspaceEdits) => {
  if (workspaceEdits.length === 0) {
    return
  }
  const workspaceEdit = workspaceEdits[0]
  const positionBasedEdits = toPositionBasedEdits(editor.textDocument, workspaceEdit.edits)
  Editor.scheduleDocumentAndCursorsSelections(editor, positionBasedEdits)
}

export const finish = async (editor) => {
  // TODO what if cursor position changes while rename is in progress?
  // TODO what happens if file content changes while rename is in progress?
  // TODO what happens when file is closed while rename is in progress?
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const newName = await RendererProcess.invoke(/* EditorRename.finish */ 4513)
  // TODO support canceling rename (e.g. when user presses escape)
  const workspaceEdits = await rename(editor, rowIndex, columnIndex, newName)
  await applyWorkspaceEdits(editor, workspaceEdits)
  // console.log({ workspaceEdits })
  // Editor.scheduleDocumentAndSelections(editor)
  // console.log({ workspaceEdits })
}

export const abort = async () => {
  await RendererProcess.invoke(/* EditorRename.closeWidget */ 4514)
}
