import * as Arrays from '../Arrays/Arrays.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Assert from '../Assert/Assert.ts'

export const getBulkReplacementEdits = (workspacePath, matches) => {
  Assert.string(workspacePath)
  Assert.array(matches)
  const files = []
  const ranges = []
  let currentRanges = []
  for (const match of matches) {
    // @ts-ignore
    const { type, title, text } = match
    switch (type) {
      case TextSearchResultType.File:
        ranges.push(currentRanges.length)
        Arrays.push(ranges, currentRanges)
        const absolutePath = `${workspacePath}/${text.slice(2)}`
        files.push(absolutePath) // TODO
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
