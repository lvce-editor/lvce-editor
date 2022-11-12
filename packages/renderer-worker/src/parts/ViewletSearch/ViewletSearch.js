import * as Command from '../Command/Command.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Compare from '../Compare/Compare.js'
import * as Assert from '../Assert/Assert.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as SearchResultType from '../SearchResultType/SearchResultType.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const name = ViewletModuleId.Search

/**
 * @enum {string}
 */
export const UiStrings = {
  NoResults: 'No results found',
  Oneresult: 'Found 1 result in 1 file',
  ManyResultsInOneFile: `Found {PH1} results in 1 file`,
  ManyResultsInManyFiles: `Found {PH1} results in {PH2} files`,
}

export const create = (id, uri, left, top, width, height) => {
  return {
    searchResults: [],
    stats: {},
    searchId: -1,
    value: '',
    disposed: false,
    fileCount: 0,
    left,
    top,
    width,
    height,
    items: [],
    minLineY: 0,
    maxLineY: 0,
    deltaY: 0,
    headerHeight: 61, // TODO
    itemHeight: 22,
    scrollBarHeight: 0,
    minimumSliderSize: 20, // TODO this should be the same for all components
  }
}

const getSavedValue = (savedState) => {
  if (savedState && savedState.value) {
    return savedState.value
  }
  return ''
}

export const saveState = (state) => {
  const { value } = state
  return {
    value,
  }
}

export const loadContent = async (state, savedState) => {
  const savedValue = getSavedValue(savedState)
  if (savedValue) {
    return setValue(state, savedValue)
  }
  return state
}

const getStatusMessage = (resultCount, fileResultCount) => {
  if (resultCount === 0) {
    return I18nString.i18nString(UiStrings.NoResults)
  }
  if (resultCount === 1) {
    return I18nString.i18nString(UiStrings.Oneresult)
  }
  if (fileResultCount === 1) {
    return I18nString.i18nString(UiStrings.ManyResultsInOneFile, {
      PH1: resultCount,
    })
  }
  return I18nString.i18nString(UiStrings.ManyResultsInManyFiles, {
    PH1: resultCount,
    PH2: fileResultCount,
  })
}

const getResultCounts = (results) => {
  let resultCount = 0
  for (const result of results) {
    const [fileName, matches] = result
    resultCount += matches.length
  }
  return resultCount
}

export const setValue = async (state, value) => {
  try {
    const { height, itemHeight, minimumSliderSize, headerHeight } = state
    const root = Workspace.state.workspacePath
    const results = await TextSearch.textSearch(root, value)
    const resultCount = getResultCounts(results)
    const displayResults = toDisplayResults(results, itemHeight, resultCount)
    const fileResultCount = results.length
    const message = getStatusMessage(resultCount, fileResultCount)
    const total = displayResults.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(
      height,
      contentHeight,
      minimumSliderSize
    )
    const numberOfVisible = Math.ceil(listHeight / itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...state,
      value,
      items: displayResults,
      message,
      maxLineY: maxLineY,
      scrollBarHeight,
      finalDeltaY,
    }
  } catch (error) {
    return {
      ...state,
      message: `${error}`,
      value,
    }
  }
}

const updateIcon = (item) => {
  switch (item.type) {
    case SearchResultType.File:
      return {
        ...item,
        icon: IconTheme.getFileIcon({ name: item.text }),
      }
    default:
      return item
  }
}

export const handleIconThemeChange = (state) => {
  const { items } = state
  const newItems = items.map(updateIcon)
  return {
    ...state,
    items: newItems,
  }
}

export const dispose = async (state) => {
  // TODO cancel pending search
  if (state.state === 'searching') {
    await TextSearch.cancel(state.searchId)
  }
  return {
    ...state,
    disposed: true,
  }
}

const getPath = (result) => {
  return result[0]
}

const getPreviews = (result) => {
  const previews = result[1]
  if (!Array.isArray(previews)) {
    throw new Error('previews must be of type array')
  }
  return previews
}

const compareResults = (resultA, resultB) => {
  const pathA = getPath(resultA)
  const pathB = getPath(resultB)
  return Compare.compareString(pathA, pathB)
}

const toDisplayResults = (results, itemHeight, resultCount) => {
  results.sort(compareResults)
  const displayResults = []
  let i = -1
  const setSize = resultCount
  for (const result of results) {
    i++
    const path = getPath(result)
    const previews = getPreviews(result)
    const absolutePath = Workspace.getAbsolutePath(path)
    const baseName = Workspace.pathBaseName(path)
    displayResults.push({
      title: absolutePath,
      type: SearchResultType.File,
      text: baseName,
      icon: IconTheme.getFileIcon({ name: baseName }),
      posInSet: i + 1,
      setSize,
      top: i * itemHeight,
      lineNumber: result.lineNumber,
    })
    for (const preview of previews) {
      i++
      displayResults.push({
        title: preview.preview,
        type: SearchResultType.Preview,
        text: preview.preview,
        icon: '',
        posInSet: i + 1,
        setSize,
        top: i * itemHeight,
        lineNumber: preview.lineNumber,
      })
    }
  }
  return displayResults
}
// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results

export const handleInput = (state, value) => {
  return setValue(state, value)
}

const getFileIndex = (items, index) => {
  console.log({ items })
  for (let i = index; i >= 0; i--) {
    const item = items[i]
    if (item.type === SearchResultType.File) {
      return i
    }
  }
  return -1
}

const selectIndexFile = async (state, searchResult, index) => {
  const path = searchResult.title
  Assert.string(path)
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path)
  return state
}

const selectIndexPreview = async (state, searchResult, index) => {
  const { items } = state
  const fileIndex = getFileIndex(items, index)
  if (fileIndex === -1) {
    throw new Error('Search result is missing file')
  }
  const { lineNumber } = searchResult
  // console.log({ searchResult })
  const fileResult = items[fileIndex]
  const path = fileResult.title
  Assert.string(path)
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ path,
    /* focus */ true,
    {
      selections: new Uint32Array([lineNumber, 0, lineNumber, 0]),
    }
  )
  return state
}

export const selectIndex = async (state, index) => {
  if (index === -1) {
    return state
  }
  const { items } = state
  const searchResult = items[index]
  switch (searchResult.type) {
    case SearchResultType.File:
      return selectIndexFile(state, searchResult, index)
    case SearchResultType.Preview:
      return selectIndexPreview(state, searchResult, index)
    default:
      throw new Error(`unexpected search result type ${searchResult.type}`)
  }
}

export const handleContextMenuMouseAt = async (state, x, y) => {
  const index = 1
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Search
  )
  return state
}

export const handleContextMenuKeyboard = async (state) => {
  const index = 1
  const x = state.left // TODO
  const y = state.top // TODO
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Search
  )
  return state
}

export const handleClick = async (state, index) => {
  const { minLineY } = state
  const actualIndex = index + minLineY
  return selectIndex(state, actualIndex)
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const hasFunctionalRender = true

const getVisible = (state) => {
  const { minLineY, maxLineY, items } = state
  return items.slice(minLineY, maxLineY)
}

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visible = getVisible(newState)
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setResults',
      /* results */ visible,
    ]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY
    )
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight
    )
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setScrollBar',
      /* scrollBarY */ scrollBarY,
      /* scrollBarHeight */ newState.scrollBarHeight,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setContentHeight',
      /* contentHeight */ contentHeight,
    ]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setMessage',
      /* message */ newState.message,
    ]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Search,
      /* method */ 'setNegativeMargin',
      /* negativeMargin */ -newState.deltaY,
    ]
  },
}

export const render = [
  renderItems,
  renderMessage,
  renderValue,
  renderScrollBar,
  renderHeight,
  renderNegativeMargin,
]
