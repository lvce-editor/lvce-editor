import VError from 'verror'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  referenceProviders: Object.create(null),
}

/**
 * @param {vscode.ReferenceProvider} referenceProvider
 */
export const registerReferenceProvider = (referenceProvider) => {
  state.referenceProviders[referenceProvider.languageId] = referenceProvider
}

/**
 * @param {vscode.ReferenceProvider} referenceProvider
 */
export const unregisterReferenceProvider = (referenceProvider) => {
  delete state.referenceProviders[referenceProvider.languageId]
}

export const executeReferenceProvider = async (documentId, offset) => {
  try {
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.warn(
        'no reference possible for document, document id',
        documentId,
        'not found'
      )
      return undefined
    }
    const referenceProvider = state.referenceProviders[textDocument.languageId]
    console.log({ state })
    if (!referenceProvider) {
      throw new VError(
        `no reference provider found for ${textDocument.languageId}`
      )
    }
    const references = await referenceProvider.provideReferences(
      textDocument,
      offset
    )
    return references
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute reference provider',
    })
  }
}
