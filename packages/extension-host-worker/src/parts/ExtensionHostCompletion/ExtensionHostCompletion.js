import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  completionProviderMap: Object.create(null),
}

export const registerCompletionProvider = (completionProvider) => {
  state.completionProviderMap[completionProvider.languageId] ||= []
  state.completionProviderMap[completionProvider.languageId].push(
    completionProvider
  )
}

export const unregisterCompletionProvider = (completionProvider) => {
  const completionProviders =
    state.completionProviderMap[completionProvider.languageId] || []
  const index = completionProviders.indexOf(completionProvider)
  if (index === -1) {
    throw new Error('not registered')
  }
  completionProviders.splice(index, 1)
}

const executeCompletionProviderInternal = async (documentId, offset) => {
  const textDocument = TextDocument.get(documentId)
  if (!textDocument) {
    console.info(
      `no completion possible for document, document id ${documentId} not found`
    )
    return []
  }
  console.log('oc', documentId, offset)
  console.log(state)
  console.log(textDocument)
  const completionProviders =
    state.completionProviderMap[textDocument.languageId] || []
  const completions = await Promise.all(
    completionProviders.map((completionProvider) =>
      completionProvider.provideCompletions(textDocument, offset)
    )
  )
  const flatCompletions = completions.flat(1)
  return flatCompletions
}

export const executeCompletionProvider = async (documentId, offset) => {
  try {
    Assert.number(documentId)
    Assert.number(offset)
    const result = await executeCompletionProviderInternal(documentId, offset)
    if (!Array.isArray(result)) {
      throw new Error('Invalid completion items')
    }
    for (const item of result) {
      if (typeof item !== 'object') {
        throw new Error(`invalid completion item: ${item}`)
      }
    }
    return result
  } catch (error) {
    throw new Error('Failed to execute completion provider', {
      // @ts-ignore
      cause: error,
    })
  }
}
