import { VError } from '../VError/VError.js'

export const state = {
  textSearchProviders: Object.create(null),
}

export const registerTextSearchProvider = (textSearchProvider) => {
  try {
    if (!textSearchProvider) {
      throw new Error('textSearchProvider is not defined')
    }
    if (!textSearchProvider.scheme) {
      throw new Error('textSearchProvider is missing scheme')
    }
    state.textSearchProviders[textSearchProvider.scheme] = textSearchProvider
  } catch (error) {
    throw new VError(error, `Failed to register text search provider`)
  }
}

export const executeTextSearchProvider = async (scheme, query) => {
  try {
    const textSearchProvider = state.textSearchProviders[scheme]
    if (!textSearchProvider) {
      throw new Error(`no text search provider for ${scheme} found`)
    }
    const results = await textSearchProvider.provideTextSearchResults(query)
    return results
  } catch (error) {
    throw new VError(error, `Failed to execute text search provider`)
  }
}

export const reset = () => {
  state.textSearchProviders = Object.create(null)
}
