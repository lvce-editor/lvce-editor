import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executePrepareRenameProvider = async (editor, offset) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onRename:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.prepareRename */ 'ExtensionHostRename.executePrepareRename',
    /* documentId */ editor.id,
    /* offset */ offset
  )
}

export const executeRenameProvider = async (editor, offset, newName) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onRename:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.rename */ 'ExtensionHostRename.executeRename',
    /* documentId */ editor.id,
    /* offset */ offset,
    /* newName */ newName
  )
}
