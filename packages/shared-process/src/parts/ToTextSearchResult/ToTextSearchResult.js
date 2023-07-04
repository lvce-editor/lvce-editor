import * as EncodingType from '../EncodingType/EncodingType.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'

const getLines = (parsedLineData) => {
  if (parsedLineData.lines.text) {
    return parsedLineData.lines.text
  }
  if (parsedLineData.lines.bytes) {
    return Buffer.from(parsedLineData.lines.bytes, EncodingType.Base64).toString()
  }
  throw new Error(`unable to parse line data`)
}

const getRemainingSubMatches = (submatches, remaining) => {
  if (submatches.length < remaining) {
    return submatches
  }
  return submatches.slice(0, remaining)
}

const RE_WORD = /\b/g

const leftCut = (text, final, charsBefore) => {
  if (text.length < charsBefore) {
    return text.length
  }
  let i = 0
  while (RE_WORD.test(text)) {
    if (final - RE_WORD.lastIndex < charsBefore) {
      break
    }
    i = RE_WORD.lastIndex
    RE_WORD.lastIndex++
  }
  RE_WORD.lastIndex = 0
  if (final - i > charsBefore + 10) {
    return final - charsBefore
  }
  return i
}

export const toTextSearchResult = (parsedLine, remaining, charsBefore, charsAfter) => {
  const results = []
  const parsedLineData = parsedLine.data
  const lines = getLines(parsedLineData)
  const lineNumber = parsedLineData.line_number
  const submatches = parsedLineData.submatches
  const linesLength = lines.length
  for (const submatch of submatches) {
    const previewStart = Math.max(submatch.start - charsBefore, 0)
    let actualStart = previewStart
    // if (actualStart > 0) {
    //   actualStart = leftCut(lines, submatch.start, charsBefore)
    // }
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
