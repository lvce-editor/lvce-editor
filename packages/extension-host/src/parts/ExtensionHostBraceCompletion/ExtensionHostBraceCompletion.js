import * as Assert from '../Assert/Assert.js'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as Registry from '../Registry/Registry.js'

export const state = {
  braceCompletionProviderMap: Object.create(null),
}

export const registerBraceCompletionProvider = (braceCompletionProvider) => {
  state.braceCompletionProviderMap[braceCompletionProvider.languageId] =
    braceCompletionProvider
}

export const unregisterBraceCompletionProvider = (braceCompletionProvider) => {
  const braceCompletionProviders =
    state.braceCompletionProviderMap[braceCompletionProvider.languageId] || []
  const index = braceCompletionProviders.indexOf(braceCompletionProvider)
  if (index === -1) {
    throw new Error('not registered')
  }
  braceCompletionProviders.splice(index, 1)
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
      state.braceCompletionProviderMap[textDocument.languageId]
    if (!braceCompletionProvider) {
      return undefined
    }
    const braceCompletion =
      await braceCompletionProvider.provideBraceCompletion(
        textDocument,
        offset,
        openingBrace
      )
    return braceCompletion
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute brace completion provider',
    })
  }
}

export const createBraceCompletionRegistry = () => {
  const registry = Registry.create({
    name: 'BraceCompletion',
  })
  return registry
}
