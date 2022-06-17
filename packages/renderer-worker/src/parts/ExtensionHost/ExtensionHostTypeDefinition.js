import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeTypeDefinitionProvider = async (editor, offset) => {
  await ExtensionHostManagement.activateByEvent(
    `onTypeDefinition:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHost.executeTypeDefinitionProvider */ 'ExtensionHostClosingTag.executeTypeDefinitionProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
