import * as IconTheme from '../IconTheme/IconTheme.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'

const getDisplayResult = (result, itemHeight, i, setSize, searchTermLength, replacement) => {
  const { type, text, lineNumber, start } = result
  const posInSet = i + 1
  const top = i * itemHeight
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
        posInSet,
        setSize,
        top,
        lineNumber,
        matchStart: 0,
        matchLength: 0,
        replacement: '',
        depth: 0,
        matchCount: 0,
      }
    case TextSearchResultType.Match:
      return {
        title: text,
        type: TextSearchResultType.Match,
        text: text,
        icon: '',
        posInSet,
        setSize,
        top,
        lineNumber,
        matchStart: start,
        matchLength: searchTermLength,
        replacement,
        depth: 1,
        matchCount: 0,
      }
    default:
      throw new Error('unexpected search result type')
  }
}

const getFilteredResults = (results, collapsedPaths) => {
  const filteredResults = []
  let isExcluded = false
  for (const result of results) {
    if (result.type === TextSearchResultType.File) {
      if (collapsedPaths.includes(result.text)) {
        isExcluded = true
      } else {
        isExcluded = false
      }
    }
    if (!isExcluded) {
      filteredResults.push(result)
    }
  }
  return filteredResults
}

export const getDisplayResults = (results, itemHeight, resultCount, searchTerm, minLineY, maxLineY, replacement, collapsedPaths) => {
  const displayResults = []
  const filteredResults = getFilteredResults(results, collapsedPaths)
  const setSize = resultCount
  let fileIndex = 0
  for (let i = 0; i < minLineY; i++) {
    const result = filteredResults[i]
    switch (result.type) {
      case TextSearchResultType.File:
        fileIndex++
        break
      default:
        break
    }
  }
  const searchTermLength = searchTerm.length
  let fileResult = {
    matchCount: 0,
  }
  for (let i = minLineY; i < maxLineY; i++) {
    const result = filteredResults[i]
    const displayResult = getDisplayResult(result, itemHeight, i, setSize, searchTermLength, replacement)
    displayResults.push(displayResult)
    if (result.type === TextSearchResultType.File) {
      fileResult = displayResult
    } else {
      fileResult.matchCount++
    }
  }
  return displayResults
}
