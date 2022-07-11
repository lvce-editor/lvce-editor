import * as ExtensionHost from './ExtensionHostCore.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const executeClosingTagProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  const ipc = await ExtensionHostManagement.activateByEvent(
    `onClosingTag:${textDocument.languageId}`
  )
  return ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHostClosingTag.executeClosingTagProvider */ 'ExtensionHostClosingTag.executeClosingTagProvider',
    /* textDocumentId */ textDocument.id,
    /* offset */ offset,
    /* openingBrace */ openingBrace
  )
}
