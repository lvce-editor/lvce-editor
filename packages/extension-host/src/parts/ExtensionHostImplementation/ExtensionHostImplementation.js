import VError from 'verror'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  implementationProviders: Object.create(null),
}

/**
 * @param {vscode.ImplementationProvider} implementationProvider
 */
export const registerImplementationProvider = (implementationProvider) => {
  state.implementationProviders[implementationProvider.languageId] =
    implementationProvider
}

/**
 * @param {vscode.ImplementationProvider} implementationProvider
 */
export const unregisterImplementationProvider = (implementationProvider) => {
  delete state.implementationProviders[implementationProvider.languageId]
}

export const executeImplementationProvider = async (documentId, offset) => {
  try {
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.warn(
        'no implementation possible for document, document id',
        documentId,
        'not found'
      )
      return undefined
    }
    const implementationProvider =
      state.implementationProviders[textDocument.languageId]
    if (!implementationProvider) {
      throw new VError(
        `no implementation provider found for ${textDocument.languageId}`
      )
    }
    const implementation = await implementationProvider.provideImplementations(
      textDocument,
      offset
    )
    return implementation
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute implementation provider',
    })
  }
}
