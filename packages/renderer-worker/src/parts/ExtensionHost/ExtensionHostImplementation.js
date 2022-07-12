import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeImplementationProvider = async (editor, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onImplementation:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHost.executeImplementationProvider */ 'ExtensionHostImplementation.executeImplementationProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
