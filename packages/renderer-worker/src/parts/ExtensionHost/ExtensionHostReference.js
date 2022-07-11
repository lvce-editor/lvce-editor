import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeReferenceProvider = async (editor, offset) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onReferences:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.executeReferenceProvider */ 'ExtensionHostReferences.executeReferenceProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
