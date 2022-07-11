import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  referenceProviders: Object.create(null),
}

export const registerReferenceProvider = (referenceProvider) => {
  state.referenceProviders[referenceProvider.languageId] = referenceProvider
}

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
      throw new Error(
        `no reference provider found for ${textDocument.languageId}`
      )
    }
    const references = await referenceProvider.provideReferences(
      textDocument,
      offset
    )
    return references
  } catch (error) {
    throw new Error('Failed to execute reference provider', {
      // @ts-ignore
      cause: error,
    })
  }
}
