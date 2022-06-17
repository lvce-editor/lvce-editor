import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeImplementationProvider = async (editor, offset) => {
  await ExtensionHostManagement.activateByEvent(
    `onImplementation:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHost.executeImplementationProvider */ 'ExtensionHostImplementation.executeImplementationProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
