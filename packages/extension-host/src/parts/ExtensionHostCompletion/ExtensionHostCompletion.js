import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import { ow } from '../Validation/Validation.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { ExecutionError } from '../Error/Error.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  completionProviderMap: Object.create(null),
}

export const registerCompletionProvider = (completionProvider) => {
  if (VALIDATION_ENABLED) {
    ow.object.partialShape({
      languageId: ow.string,
      provideCompletions: ow.function,
      triggerCharacters: ow.optional.array.ofType(ow.string),
    })
  }
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
  if (VALIDATION_ENABLED) {
    ow(documentId, ow.number)
    ow(offset, ow.number)
  }
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
    return await executeCompletionProviderInternal(documentId, offset)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute completion provider',
    })
  }
}
