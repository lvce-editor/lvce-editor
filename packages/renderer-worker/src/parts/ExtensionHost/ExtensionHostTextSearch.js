import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTextSearchProvider = async (scheme, query, assetDir, platform) => {
  const result = await ExtensionHostShared.executeProviders({
    event: `onTextSearch:${scheme}`,
    method: ExtensionHostCommandType.TextSearchExecuteTextSearchProvider,
    params: [scheme, query],
    noProviderFoundMessage: 'no text search providers found',
    noProviderFoundResult: [],
    combineResults,
    assetDir,
    platform,
  })
  return result
}

export const textSearchHtml = (...args) => {
  return ExtensionHostWorker.invoke('TextSearchHtml.textSearch', ...args)
}

export const textSearchFetch = (...args) => {
  return ExtensionHostWorker.invoke('TextSearchFetch.textSearch', ...args)
}

export const textSearchMemory = (...args) => {
  return ExtensionHostWorker.invoke('TextSearchMemory.textSearch', ...args)
}

export const textSearchMemory2 = (...args) => {
  return ExtensionHostWorker.invoke('TextSearchMemory.textSearch2', ...args)
}
