import * as Assert from '../Assert/Assert.js'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  closingTagProviders: Object.create(null),
}

export const registerClosingTagProvider = (closingTagProvider) => {
  state.closingTagProviders[closingTagProvider.languageId] = closingTagProvider
}

export const executeClosingTagProvider = async (documentId, offset) => {
  try {
    Assert.number(documentId)
    Assert.number(offset)
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.info(
        `no closing tag possible for document, document id ${documentId} not found`
      )
      return undefined
    }
    const closingTagProvider =
      state.closingTagProviders[textDocument.languageId]
    if (!closingTagProvider) {
      return undefined
    }
    const closingTag = await closingTagProvider.provideClosingTag(
      textDocument,
      offset
    )
    return closingTag
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute closing tag provider',
    })
  }
}
