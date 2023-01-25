import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Compare from '../Compare/Compare.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as Height from '../Height/Height.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as Workspace from '../Workspace/Workspace.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NoResults: 'No results found',
  Oneresult: 'Found 1 result in 1 file',
  ManyResultsInOneFile: `Found {PH1} results in 1 file`,
  ManyResultsInManyFiles: `Found {PH1} results in {PH2} files`,
}

export const create = (id, uri, x, y, width, height) => {
  return {
    searchResults: [],
    stats: {},
    searchId: -1,
    value: '',
    disposed: false,
    fileCount: 0,
    x,
    y,
    width,
    height,
    ...VirtualList.create({
      itemHeight: Height.ListItem,
      minimumSliderSize: Height.MinimumSliderSize,
      headerHeight: 61, // TODO
    }),
    threads: 0,
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

const getThreads = () => {
  const value = Preferences.get('search.threads')
  if (typeof value !== 'number' || value < 0 || value > 8) {
    return 0
  }
  return value
}

export const loadContent = async (state, savedState) => {
  const savedValue = getSavedValue(savedState)
  const threads = getThreads()
  if (savedValue) {
    return setValue(state, savedValue, threads)
  }
  return { ...state, threads }
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

export const setValue = async (state, value, threads = state.threads) => {
  try {
    if (value === '') {
      return {
        ...state,
        value,
        minLineY: 0,
        maxLineY: 0,
        deltaY: 0,
        items: [],
        matchIndex: 0,
        matchCount: 0,
        message: '',
        threads,
      }
    }
    const { height, itemHeight, minimumSliderSize, headerHeight } = state
    const root = Workspace.state.workspacePath
    const results = await TextSearch.textSearch(root, value, {
      threads,
    })
    if (!Array.isArray(results)) {
      throw new Error(`results must be of type array`)
    }
    const { fileCount, resultCount } = getResultCounts(results)
    const displayResults = toDisplayResults(results, itemHeight, resultCount, value)
    const message = getStatusMessage(resultCount, fileCount)
    const total = displayResults.length
    const contentHeight = total * itemHeight
    const listHeight = height - headerHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(height, contentHeight, minimumSliderSize)
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
      threads,
    }
  } catch (error) {
    ErrorHandling.logError(error)
    return {
      ...state,
      message: `${error}`,
      value,
      threads,
    }
  }
}

const updateIcon = (item) => {
  switch (item.type) {
    case TextSearchResultType.File:
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

const compareResults = (resultA, resultB) => {
  const pathA = resultA.text
  const pathB = resultB.text
  return Compare.compareString(pathA, pathB)
}

const getMatchStart = (preview, searchTerm) => {
  const index = preview.preview.indexOf(searchTerm)
  if (index === -1) {
    return preview.preview.toLowerCase().indexOf(searchTerm)
  }
  return index
}

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
    if (item.type === TextSearchResultType.File) {
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
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ path, /* focus */ true, {
    selections: new Uint32Array([lineNumber, 0, lineNumber, 0]),
  })
  return state
}

export const selectIndex = async (state, index) => {
  if (index === -1) {
    return state
  }
  const { items } = state
  const searchResult = items[index]
  switch (searchResult.type) {
    case TextSearchResultType.File:
      return selectIndexFile(state, searchResult, index)
    case TextSearchResultType.Match:
      return selectIndexPreview(state, searchResult, index)
    default:
      throw new Error(`unexpected search result type ${searchResult.type}`)
  }
}

export const handleContextMenuMouseAt = async (state, x, y) => {
  const index = 1
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Search)
  return state
}

export const handleContextMenuKeyboard = async (state) => {
  const index = 1
  const x = state.x // TODO
  const y = state.y // TODO
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Search)
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
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visible = getVisible(newState)
    return [/* method */ 'setResults', /* results */ visible]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.height === newState.height && oldState.finalDeltaY === newState.finalDeltaY
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight
    )
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ 'setContentHeight', /* contentHeight */ contentHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setMessage', /* message */ newState.message]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ 'setValue', /* value */ newState.value]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [/* method */ 'setNegativeMargin', /* negativeMargin */ -newState.deltaY]
  },
}

export const render = [renderItems, renderMessage, renderValue, renderScrollBar, renderHeight, renderNegativeMargin]
