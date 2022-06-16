import VError from 'verror'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  semanticTokenProviders: {},
}

export const registerSemanticTokenProvider = (semanticTokenProvider) => {
  state.semanticTokenProviders[semanticTokenProvider.languageId] =
    semanticTokenProvider
}

export const executeSemanticTokenProvider = async (documentId) => {
  try {
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.info(
        `no completion possible for document, document id ${documentId} not found`
      )
      return []
    }
    const semanticTokenProvider =
      state.semanticTokenProviders[textDocument.languageId]
    if (!semanticTokenProvider) {
      throw new VError(
        `no semantic token provider found for ${textDocument.languageId}`
      )
    }
    const semanticTokens =
      semanticTokenProvider.provideSemanticTokens(textDocument)
    return semanticTokens
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute semantic token provider',
    })
  }
}
