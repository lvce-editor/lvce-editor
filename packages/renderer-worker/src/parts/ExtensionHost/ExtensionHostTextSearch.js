import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTextSearchProvider = async (scheme, query) => {
  const result = await ExtensionHostShared.executeProviders({
    event: `onTextSearch:${scheme}`,
    method: ExtensionHostCommandType.TextSearchExecuteTextSearchProvider,
    params: [scheme, query],
    noProviderFoundMessage: 'no text search providers found',
    noProviderFoundResult: [],
    combineResults,
  })
  return result
}
