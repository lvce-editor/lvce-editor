import * as GetSearchRegex from '../GetSearchRegex/GetSearchRegex.ts'
import * as FindRegexMatches from '../FindRegexMatches/FindRegexMatches.ts'

export const findMatchesCaseInsensitive = (lines: readonly string[], searchString: string) => {
  if (searchString.length === 0) {
    return new Uint32Array([])
  }
  const regex = GetSearchRegex.getSearchRegex(searchString)
  return FindRegexMatches.findRegexMatches(lines, regex)
}
