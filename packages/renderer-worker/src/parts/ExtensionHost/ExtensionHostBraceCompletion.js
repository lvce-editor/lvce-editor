import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeBraceCompletionProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onBraceCompletion:${textDocument.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHostBraceCompletion.executeBraceCompletionProvider */ 'ExtensionHostBraceCompletion.executeBraceCompletionProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset,
    /* openingBrace */ openingBrace
  )
}
