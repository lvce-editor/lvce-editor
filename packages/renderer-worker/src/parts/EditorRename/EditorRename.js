import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.js'
import * as ExtensionHostRename from '../ExtensionHost/ExtensionHostRename.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const state = {
  editor: undefined,
}

const prepareRename = async (editor) => {
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  return ExtensionHostRename.executePrepareRenameProvider(editor, offset)
}

const rename = (editor, newName) => {
  const offset = TextDocument.offsetAt(editor, editor.cursor)
  return ExtensionHostRename.executeRenameProvider(editor, offset)
}

export const open = async (editor) => {
  // TODO handle error and add tests for handled error
  const prepareRenameResult = await prepareRename(editor)

  // TODO race condition, what is when editor is closed before promise resolves

  if (prepareRenameResult.canRename) {
    const x = EditorPosition.x(editor, editor.cursor)
    const y = EditorPosition.y(editor, editor.cursor)
    // const prepareRenameResult = await prepareRename(editor)
    // console.log({ prepareRenameResult })
    await RendererProcess.invoke(
      /* EditorRename.openWidget */ 4512,
      /* x */ x,
      /* y */ y
    )
  } else {
    // TODO also show error when promise rejects
    await Command.execute(
      /* EditorError.show */ 3900,
      /* editor */ editor,
      /* message */ 'You cannot rename this element',
      /* position */ editor.cursor
    )
  }
}

const toPositionBasedEdits = (textDocument, edits) => {
  const positionBasedEdits = []
  for (const edit of edits) {
    const start = TextDocument.positionAt(textDocument, edit.offset)
    const end = TextDocument.positionAt(
      textDocument,
      edit.offset + edit.inserted.length - edit.deleted
    )
    positionBasedEdits.push({
      start,
      end,
      inserted: edit.inserted.split('\n'),
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
  const positionBasedEdits = toPositionBasedEdits(
    editor.textDocument,
    workspaceEdit.edits
  )
  Editor.scheduleDocumentAndCursorsSelections(editor, positionBasedEdits)
}

export const finish = async (editor) => {
  const newName = await RendererProcess.invoke(/* EditorRename.finish */ 4513)
  console.log('do actual rename', { value: newName })
  // TODO support canceling rename (e.g. when user presses escape)
  const workspaceEdits = await rename(editor, newName)
  await applyWorkspaceEdits(editor, workspaceEdits)
  // console.log({ workspaceEdits })
  // Editor.scheduleDocumentAndSelections(editor)
  // console.log({ workspaceEdits })
}

export const abort = async () => {
  await RendererProcess.invoke(/* EditorRename.closeWidget */ 4514)
}
