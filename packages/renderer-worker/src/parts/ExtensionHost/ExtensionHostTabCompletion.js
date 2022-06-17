import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeTabCompletionProvider = async (textDocument, offset) => {
  await ExtensionHostManagement.activateByEvent(
    `onTabCompletion:${textDocument.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHostTabCompletion.execute */ 'ExtensionHost.executeTabCompletionProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset
  )
}
