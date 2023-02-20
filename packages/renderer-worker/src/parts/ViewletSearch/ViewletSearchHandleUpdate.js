import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

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
    // const displayResults = toDisplayResults(results, itemHeight, resultCount, value)
    const message = ViewletSearchStatusMessage.getStatusMessage(resultCount, fileCount)
    const total = results.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(height, contentHeight, minimumSliderSize)
    const numberOfVisible = Math.ceil(listHeight / itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...partialNewState,
      value,
      items: results,
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
