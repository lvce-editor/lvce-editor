import * as ExtensionHostTextSearch from './ExtensionHostTextSearch.js'

export const name = 'ExtensionHostTextSearch'

export const Commands = {
  executeTextSearchProvider: ExtensionHostTextSearch.executeTextSearchProvider,
  textSearchFetch: ExtensionHostTextSearch.textSearchFetch,
  textSearchMemory: ExtensionHostTextSearch.textSearchMemory,
  textSearchHtml: ExtensionHostTextSearch.textSearchHtml,
}
