import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTextSearchProvider = async (scheme, query) => {
  const result = await ExtensionHostShared.executeProviders({
    event: `onTextSearch:${scheme}`,
    method: 'ExtensionHostTextSearch.executeTextSearchProvider',
    params: [query],
    noProviderFoundMessage: 'no text search providers found',
    noProviderFoundResult: [],
    combineResults,
  })
  Assert.array(result)
  console.log({ result })
  return result
}
