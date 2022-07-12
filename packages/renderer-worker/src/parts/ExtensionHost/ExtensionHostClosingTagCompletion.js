import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeClosingTagProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  const extensionHost = await ExtensionHostManagement.activateByEvent(
    `onClosingTag:${textDocument.languageId}`
  )
  return extensionHost.invoke(
    /* ExtensionHostClosingTag.executeClosingTagProvider */ 'ExtensionHostClosingTag.executeClosingTagProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset,
    /* openingBrace */ openingBrace
  )
}
