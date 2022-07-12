import * as ExtensionHost from '../ExtensionHost/ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executePrepareRenameProvider = async (editor, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onRename:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHost.prepareRename */ 'ExtensionHostRename.executePrepareRename',
    /* documentId */ editor.id,
    /* offset */ offset
  )
}

export const executeRenameProvider = async (editor, offset, newName) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onRename:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHost.rename */ 'ExtensionHostRename.executeRename',
    /* documentId */ editor.id,
    /* offset */ offset,
    /* newName */ newName
  )
}
