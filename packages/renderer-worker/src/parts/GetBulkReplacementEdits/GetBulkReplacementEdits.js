import * as Arrays from '../Arrays/Arrays.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

export const getBulkReplacementEdits = (matches) => {
  const files = []
  const ranges = []
  let currentRanges = []
  for (const match of matches) {
    switch (match.type) {
      case TextSearchResultType.File:
        ranges.push(currentRanges.length)
        Arrays.push(ranges, currentRanges)
        files.push(match.title)
        currentRanges = []
        break
      case TextSearchResultType.Match:
        currentRanges.push(match.lineNumber - 1, match.matchStart, match.lineNumber - 1, match.matchStart + match.matchLength)
        break
      default:
        break
    }
  }
  ranges.push(currentRanges.length)
  Arrays.push(ranges, currentRanges)
  return {
    files,
    ranges: ranges.slice(1),
  }
}
