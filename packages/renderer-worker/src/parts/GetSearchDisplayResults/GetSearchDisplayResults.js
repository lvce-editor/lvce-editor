import * as IconTheme from '../IconTheme/IconTheme.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'

export const getDisplayResults = (results, itemHeight, resultCount, searchTerm, minLineY, maxLineY) => {
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
  for (let i = minLineY; i < maxLineY; i++) {
    const result = results[i]
    switch (result.type) {
      case TextSearchResultType.File:
        const path = result.text
        const absolutePath = Workspace.getAbsolutePath(path)
        const baseName = Workspace.pathBaseName(path)
        displayResults.push({
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
        })
        break
      case TextSearchResultType.Match:
        displayResults.push({
          title: result.text,
          type: TextSearchResultType.Match,
          text: result.text,
          icon: '',
          posInSet: i + 1,
          setSize,
          top: i * itemHeight,
          lineNumber: result.lineNumber,
          matchStart: result.start,
          matchLength: searchTerm.length,
        })
        break
      default:
        break
    }
  }
  return displayResults
}
