import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeDefinitionProvider = async (editor, offset) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onDefinition:${editor.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.getDefinition */ 'ExtensionHostDefinition.executeDefinitionProvider',
    /* textDocumentId */ editor.id,
    /* offset */ offset
  )
}
