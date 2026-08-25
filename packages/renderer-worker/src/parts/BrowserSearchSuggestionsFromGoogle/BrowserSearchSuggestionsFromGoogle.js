import * as ElectronNet from '../ElectronNet/ElectronNet.js'

export const get = async (query) => {
  const autoCompleteUrl = `https://suggestqueries.google.com/complete/search?client=chrome&hl=en&q=${encodeURIComponent(query)}`
  const json = await ElectronNet.getJson(autoCompleteUrl)
  if (!Array.isArray(json) || !Array.isArray(json[1])) {
    return []
  }
  const suggestions = json[1]
  return suggestions.filter((suggestion) => typeof suggestion === 'string' && suggestion.length > 0).slice(0, 7)
}
