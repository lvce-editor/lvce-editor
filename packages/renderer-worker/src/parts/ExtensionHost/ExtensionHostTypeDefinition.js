import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeTypeDefinitionProvider = async (editor, offset) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onTypeDefinition:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.executeTypeDefinitionProvider */ 'ExtensionHostClosingTag.executeTypeDefinitionProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
