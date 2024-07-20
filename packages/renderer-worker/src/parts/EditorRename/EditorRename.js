import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as Rename from '../Rename/Rename.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO memory leak
export const state = {
  editor: undefined,
}

const prepareRename = async (editor, rowIndex, columnIndex) => {
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  return Rename.prepareRename(editor, offset)
}

const rename = async (editor, rowIndex, columnIndex, newName) => {
  const offset = await TextDocument.offsetAt(editor, rowIndex, columnIndex)
  return Rename.rename(editor, offset, newName)
}

export const open = async () => {
  const editor = GetActiveEditor.getActiveEditor()
  if (!editor) {
    return
  }
  Assert.object(editor)
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  Assert.number(rowIndex)
  Assert.number(columnIndex)

  // TODO handle error and add tests for handled error
  const prepareRenameResult = await prepareRename(editor, rowIndex, columnIndex)

  // TODO race condition, what is when editor is closed before promise resolves

  console.log({ prepareRenameResult })
  if (prepareRenameResult && prepareRenameResult.canRename) {
    const x = EditorPosition.x(editor, rowIndex, columnIndex)
    // @ts-ignore
    const y = EditorPosition.y(editor, rowIndex, columnIndex)
    // const prepareRenameResult = await prepareRename(editor)
    // console.log({ prepareRenameResult })
    await RendererProcess.invoke(/* EditorRename.openWidget */ 4512, /* x */ x, /* y */ y)
  } else {
    // TODO also show error when promise rejects
    await Command.execute(
      /* EditorError.show */ 3900,
      /* editor */ editor,
      /* message */ 'You cannot rename this element',
      /* rowIndex */ rowIndex,
      /* columnIndex */ columnIndex,
    )
  }
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

// TODO apply to whole workspace
// TODO how to best apply workspace edit?
const applyWorkspaceEdits = async (editor, workspaceEdits) => {
  if (workspaceEdits.length === 0) {
    return
  }
  const workspaceEdit = workspaceEdits[0]
  const positionBasedEdits = toPositionBasedEdits(editor.textDocument, workspaceEdit.edits)
  await Command.execute('Editor.applyEdit', editor, positionBasedEdits)
}

// TODO make it functional
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
