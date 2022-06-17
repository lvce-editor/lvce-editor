import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeClosingTagProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  await ExtensionHostManagement.activateByEvent(
    `onClosingTag:${textDocument.languageId}`
  )
  return ExtensionHost.invoke(
    /* ExtensionHostClosingTag.executeClosingTagProvider */ 'ExtensionHostClosingTag.executeClosingTagProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset,
    /* openingBrace */ openingBrace
  )
}
