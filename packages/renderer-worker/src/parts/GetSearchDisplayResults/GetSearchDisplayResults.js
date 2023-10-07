import * as IconTheme from '../IconTheme/IconTheme.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'

const getDisplayResult = (result, itemHeight, i, setSize, searchTermLength, replacement) => {
  const { type, text, lineNumber, start } = result
  switch (type) {
    case TextSearchResultType.File:
      const path = text
      const absolutePath = Workspace.getAbsolutePath(path)
      const baseName = Workspace.pathBaseName(path)
      return {
        title: absolutePath,
        type: TextSearchResultType.File,
        text: baseName,
        icon: IconTheme.getFileIcon({ name: baseName }),
        posInSet: i + 1,
        setSize,
        top: i * itemHeight,
        lineNumber: result.lineNumber,
        matchStart: 0,
        matchLength: 0,
        replacement: '',
        depth: 0,
      }
    case TextSearchResultType.Match:
      return {
        title: text,
        type: TextSearchResultType.Match,
        text: text,
        icon: '',
        posInSet: i + 1,
        setSize,
        top: i * itemHeight,
        lineNumber: lineNumber,
        matchStart: start,
        matchLength: searchTermLength,
        replacement,
        depth: 1,
      }
    default:
      throw new Error('unexpected search result type')
  }
}

export const getDisplayResults = (results, itemHeight, resultCount, searchTerm, minLineY, maxLineY, replacement) => {
  const displayResults = []
  const setSize = resultCount
  let fileIndex = 0
  for (let i = 0; i < minLineY; i++) {
    const result = results[i]
    switch (result.type) {
      case TextSearchResultType.File:
        fileIndex++
        break
      default:
        break
    }
  }
  const searchTermLength = searchTerm.length
  for (let i = minLineY; i < maxLineY; i++) {
    const result = results[i]
    const displayResult = getDisplayResult(result, itemHeight, i, setSize, searchTermLength, replacement)
    displayResults.push(displayResult)
  }
  return displayResults
}
