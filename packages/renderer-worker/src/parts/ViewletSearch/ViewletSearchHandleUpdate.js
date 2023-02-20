import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

const toDisplayResults = (results, itemHeight, resultCount, searchTerm) => {
  // results.sort(compareResults)
  const displayResults = []
  let i = -1
  const setSize = resultCount
  let path = ''
  for (const result of results) {
    i++
    switch (result.type) {
      case TextSearchResultType.File:
        path = result.text
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

const getResultCounts = (results) => {
  let resultCount = 0
  let fileCount = 0
  for (const result of results) {
    switch (result.type) {
      case TextSearchResultType.File:
        fileCount++
        break
      case TextSearchResultType.Match:
        resultCount++
        break
      default:
        break
    }
  }
  return { fileCount, resultCount }
}

export const handleUpdate = async (state, update) => {
  const partialNewState = { ...state, ...update }
  try {
    const { height, itemHeight, minimumSliderSize, headerHeight, matchCase, value, threads } = partialNewState
    if (value === '') {
      return {
        ...partialNewState,
        minLineY: 0,
        maxLineY: 0,
        deltaY: 0,
        items: [],
        matchIndex: 0,
        matchCount: 0,
        message: '',
      }
    }
    const root = Workspace.state.workspacePath
    const results = await TextSearch.textSearch(root, value, {
      threads,
      isCaseSensitive: matchCase,
    })
    if (!Array.isArray(results)) {
      throw new Error(`results must be of type array`)
    }
    const { fileCount, resultCount } = getResultCounts(results)
    const displayResults = toDisplayResults(results, itemHeight, resultCount, value)
    const message = ViewletSearchStatusMessage.getStatusMessage(resultCount, fileCount)
    const total = displayResults.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(height, contentHeight, minimumSliderSize)
    const numberOfVisible = Math.ceil(listHeight / itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...partialNewState,
      value,
      items: displayResults,
      message,
      maxLineY: maxLineY,
      scrollBarHeight,
      finalDeltaY,
      threads,
      fileCount,
      matchCount: resultCount,
    }
  } catch (error) {
    ErrorHandling.logError(error)
    return {
      ...partialNewState,
      message: `${error}`,
    }
  }
}
