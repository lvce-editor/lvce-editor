import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeTabCompletionProvider = async (textDocument, offset) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onTabCompletion:${textDocument.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostTabCompletion.execute */ 'ExtensionHost.executeTabCompletionProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset
  )
}
