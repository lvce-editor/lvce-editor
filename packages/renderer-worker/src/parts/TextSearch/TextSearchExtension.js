import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostTextSearch from '../ExtensionHost/ExtensionHostTextSearch.js'

export const textSearch = async (scheme, root, query) => {
  Assert.string(scheme)
  Assert.string(query)
  const results = await ExtensionHostTextSearch.executeTextSearchProvider(scheme, query)
  return results
}
