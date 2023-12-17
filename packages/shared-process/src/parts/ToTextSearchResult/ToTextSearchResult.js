import * as ParseRipGrepLines from '../ParseRipGrepLines/ParseRipGrepLines.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

export const toTextSearchResult = (parsedLine, remaining, charsBefore, charsAfter) => {
  const results = []
  const parsedLineData = parsedLine.data
  const lines = ParseRipGrepLines.parseRipGrepLines(parsedLineData)
  const lineNumber = parsedLineData.line_number
  const { submatches } = parsedLineData
  const linesLength = lines.length
  for (const submatch of submatches) {
    const previewStart = Math.max(submatch.start - charsBefore, 0)
    const actualStart = previewStart
    const previewEnd = Math.min(submatch.end + charsAfter, linesLength)
    const previewText = lines.slice(actualStart, previewEnd)
    results.push({
      type: TextSearchResultType.Match,
      start: submatch.start - actualStart,
      end: submatch.end - actualStart,
      lineNumber,
      text: previewText,
    })
  }
  return results
}
