import { ow } from './_shared.js'

export const state = {
  completionProviderMap: Object.create(null),
}

export const registerCompletionProvider = (completionProvider) => {
  ow.object.partialShape({
    languageId: ow.string,
    provideCompletions: ow.function,
    triggerCharacters: ow.optional.array.ofType(ow.string),
  })
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

export const executeCompletionProvider = async (
  languageId,
  textDocument,
  offset
) => {
  const completionProviders = state.completionProviderMap[languageId] || []
  const completions = await Promise.all(
    completionProviders.map((completionProvider) =>
      completionProvider.provideCompletions(textDocument, offset)
    )
  )
  const flatCompletions = completions.flat(1)
  return flatCompletions
}
