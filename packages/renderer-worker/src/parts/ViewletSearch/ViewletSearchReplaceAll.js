import * as Command from '../Command/Command.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

const getBulkReplacementEdits = (matches) => {
  const files = []
  const ranges = []
  let currentRanges = []

  for (const match of matches) {
    switch (match.type) {
      case TextSearchResultType.File:
        ranges.push(currentRanges.length, ...currentRanges)
        files.push(match.title)
        currentRanges = []
        break
      case TextSearchResultType.Match:
        currentRanges.push(match.lineNumber, match.matchStart, match.lineNumber, match.matchStart + match.matchLength)
        break
      default:
        break
    }
  }
  return {
    files,
    ranges: ranges.slice(1),
  }
}

const actuallyReplaceAll = async (matches, replacement) => {
  const { files, ranges } = getBulkReplacementEdits(matches)
  console.log({ files, ranges })
  await Command.execute('BulkReplacement.applyBulkReplacement', files, ranges, replacement)
}

export const replaceAll = async (state) => {
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', 'Replace all?', 'Replace All')
  if (!shouldReplace) {
    return
  }
  const { items, replacement } = state
  console.log({ replacement, items })
  await actuallyReplaceAll(items, replacement)
  return state
}
