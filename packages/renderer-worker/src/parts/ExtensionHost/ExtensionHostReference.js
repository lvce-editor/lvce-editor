import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeReferenceProvider = async (editor, offset) => {
  await ExtensionHostManagement.activateByEvent(
    `onReferences:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHost.executeReferenceProvider */ 'ExtensionHostReferences.executeReferenceProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
