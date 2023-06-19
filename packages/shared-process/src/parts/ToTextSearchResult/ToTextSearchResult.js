import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

const getLines = (parsedLineData) => {
  if (parsedLineData.lines.text) {
    return parsedLineData.lines.text
  }
  if (parsedLineData.lines.bytes) {
    return Buffer.from(parsedLineData.lines.bytes, 'base64').toString()
  }
  throw new Error(`unable to parse line data`)
}

const getRemainingSubMatches = (submatches, remaining) => {
  if (submatches.length < remaining) {
    return submatches
  }
  return submatches.slice(0, remaining)
}

export const toTextSearchResult = (parsedLine, remaining, charsBefore, charsAfter) => {
  const results = []
  const parsedLineData = parsedLine.data
  const lines = getLines(parsedLineData)
  const lineNumber = parsedLineData.line_number
  const submatches = parsedLineData.submatches
  for (const submatch of submatches) {
    const previewStart = Math.max(submatch.start - charsBefore, 0)
    const previewEnd = Math.min(submatch.end + charsAfter, lines.length)
    const previewText = lines.slice(previewStart, previewEnd)
    results.push({
      type: TextSearchResultType.Match,
      start: submatch.start - previewStart,
      end: submatch.end - previewStart,
      lineNumber,
      text: previewText,
    })
  }
  return results
}
