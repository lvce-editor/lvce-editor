import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeBraceCompletionProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onBraceCompletion:${textDocument.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostBraceCompletion.executeBraceCompletionProvider */ 'ExtensionHostBraceCompletion.executeBraceCompletionProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset,
    /* openingBrace */ openingBrace
  )
}
