import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executePrepareRenameProvider = async (editor, offset) => {
  await ExtensionHostManagement.activateByEvent(`onRename:${editor.languageId}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.prepareRename */ 'ExtensionHostRename.executePrepareRename',
    /* documentId */ editor.id,
    /* offset */ offset
  )
}

export const executeRenameProvider = async (editor, offset, newName) => {
  await ExtensionHostManagement.activateByEvent(`onRename:${editor.languageId}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.rename */ 'ExtensionHostRename.executeRename',
    /* documentId */ editor.id,
    /* offset */ offset,
    /* newName */ newName
  )
}
