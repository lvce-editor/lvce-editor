import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.js'
import * as GetTextSearchResultCounts from '../GetTextSearchResultCounts/GetTextSearchResultCounts.js'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletSearchStatusMessage from './ViewletSearchStatusMessage.js'

export const handleUpdate = async (state, update) => {
  const partialNewState = { ...state, ...update }
  try {
    const { height, itemHeight, minimumSliderSize, headerHeight, matchCase, value, threads, useRegularExpression } = partialNewState
    if (IsEmptyString.isEmptyString(value)) {
      return {
        ...partialNewState,
        minLineY: 0,
        maxLineY: 0,
        deltaY: 0,
        items: [],
        matchIndex: 0,
        matchCount: 0,
        message: '',
        loaded: true,
      }
    }
    const root = Workspace.state.workspacePath
    const results = await TextSearch.textSearch(root, value, {
      threads,
      isCaseSensitive: matchCase,
      useRegularExpression,
    })
    if (!Array.isArray(results)) {
      throw new Error(`results must be of type array`)
    }
    const { fileCount, resultCount } = GetTextSearchResultCounts.getTextSearchResultCounts(results)
    const message = ViewletSearchStatusMessage.getStatusMessage(resultCount, fileCount)
    const total = results.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)
    const numberOfVisible = GetNumberOfVisibleItems.getNumberOfVisibleItems(listHeight, itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...partialNewState,
      minLineY: 0,
      deltaY: 0,
      value,
      items: results,
      message,
      maxLineY: maxLineY,
      scrollBarHeight,
      finalDeltaY,
      threads,
      fileCount,
      matchCount: resultCount,
      loaded: true,
    }
  } catch (error) {
    ErrorHandling.logError(error)
    return {
      ...partialNewState,
      message: `${error}`,
      items: [],
      matchCount: 0,
      fileCount: 0,
      minLineY: 0,
      maxLineY: 0,
    }
  }
}
