import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeDefinitionProvider = async (editor, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onDefinition:${editor.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHost.getDefinition */ 'ExtensionHostDefinition.executeDefinitionProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
