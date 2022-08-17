export const state = {
  textSearchProviders: Object.create(null),
}

export const registerTextSearchProvider = (textSearchProvider) => {
  state.textSearchProviders[textSearchProvider.scheme] = textSearchProvider
}

export const executeTextSearchProvider = async (scheme, query) => {
  const textSearchProvider = state.textSearchProviders[scheme]
  if (!textSearchProvider) {
    throw new Error(`no text search provider for ${scheme} found`)
  }
  const results = await textSearchProvider.provideTextSearchResults(query)
  return results
}

export const reset = () => {
  state.textSearchProviders = Object.create(null)
}
