import * as GetSearchRegex from '../GetSearchRegex/GetSearchRegex.js'
import * as FindRegexMatches from '../FindRegexMatches/FindRegexMatches.js'

export const findMatchesCaseInsensitive = (lines, searchString) => {
  if (searchString.length === 0) {
    return new Uint32Array([])
  }
  const regex = GetSearchRegex.getSearchRegex(searchString)
  return FindRegexMatches.findRegexMatches(lines, regex)
}
