import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

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

// TODO duplicate code with virtual list
export const setDeltaY = async (state, value) => {
  Assert.object(state)
  Assert.number(value)
  const {
    itemHeight,
    finalDeltaY,
    deltaY,
    height,
    headerHeight,
    root,
    resultCount,
    fileCount,
  } = state
  const listHeight = height - headerHeight
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return state
  }
  const minLineY = Math.floor(newDeltaY / itemHeight)
  const maxLineY = minLineY + Math.ceil(listHeight / itemHeight)
  const rangedResults = await TextSearch.getRangedResults(
    root,
    minLineY,
    maxLineY
  )
  const items = toDisplayResults(
    rangedResults,
    itemHeight,
    resultCount,
    fileCount
  )
  return {
    ...state,
    deltaY: newDeltaY,
    minLineY,
    maxLineY,
    items,
  }
}
