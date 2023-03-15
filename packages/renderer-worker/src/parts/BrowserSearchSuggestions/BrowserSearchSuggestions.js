import * as BrowserSearchSuggestionsFromGoogle from '../BrowserSearchSuggestionsFromGoogle/BrowserSearchSuggestionsFromGoogle.js'

export const get = (query) => {
  return BrowserSearchSuggestionsFromGoogle.get(query)
}
