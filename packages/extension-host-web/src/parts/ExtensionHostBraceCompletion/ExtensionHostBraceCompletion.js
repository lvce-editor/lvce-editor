import * as Assert from '../Assert/Assert.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  braceCompletionProviders: Object.create(null),
}

export const registerBraceCompletionProvider = (braceCompletionProvider) => {
  state.braceCompletionProviders[braceCompletionProvider.languageId] =
    braceCompletionProvider
}

export const executeBraceCompletionProvider = async (
  documentId,
  offset,
  openingBrace
) => {
  try {
    Assert.number(documentId)
    Assert.number(offset)
    Assert.string(openingBrace)
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.info(
        `no brace completion possible for document, document id ${documentId} not found`
      )
      return undefined
    }
    const braceCompletionProvider =
      state.braceCompletionProviders[textDocument.languageId]
    if (!braceCompletionProvider) {
      console.info(
        `no brace completion possible for document, no brace completion provider for language ${textDocument.languageId}`
      )
      return undefined
    }
    const braceCompletion = await braceCompletionProvider.getBraceCompletion(
      textDocument,
      offset,
      openingBrace
    )
    return braceCompletion
  } catch (error) {
    throw new Error('Failed to execute brace completion provider', {
      // @ts-ignore
      cause: error,
    })
  }
}
