import * as Compare from '../Compare/Compare.js'
import * as Height from '../Height/Height.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletSearchHandleUpdate from './ViewletSearchHandleUpdate.js'

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
    replaceExpanded: false,
    useRegularExpression: false,
    matchCase: false,
    matchWholeWord: false,
    replacement: '',
    matchCount: 0,
    listFocused: false,
    listFocusedIndex: -1,
  }
}

const getSavedValue = (savedState) => {
  if (savedState && savedState.value) {
    return savedState.value
  }
  return ''
}
const getSavedReplaceExpanded = (savedState) => {
  if (savedState && 'replaceExpanded' in savedState) {
    return savedState.replaceExpanded
  }
  return false
}

export const saveState = (state) => {
  const { value, replaceExpanded } = state
  return {
    value,
    replaceExpanded,
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
  const savedReplaceExpanded = getSavedReplaceExpanded(savedState)
  const threads = getThreads()
  if (savedValue) {
    return ViewletSearchHandleUpdate.handleUpdate(state, { value: savedValue, threads, replaceExpanded: savedReplaceExpanded })
  }
  return { ...state, threads, replaceExpanded: savedReplaceExpanded }
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

// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results

export const handleInput = (state, value) => {
  return ViewletSearchHandleUpdate.handleUpdate(state, { value })
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

const toDisplayResults = (results, itemHeight, resultCount, searchTerm, minLineY, maxLineY) => {
  // results.sort(compareResults)
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

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.replacement === newState.replacement
    )
  },
  apply(oldState, newState) {
    const displayResults = toDisplayResults(
      newState.items,
      newState.itemHeight,
      newState.fileCount,
      newState.value,
      newState.minLineY,
      newState.maxLineY
    )
    return [/* method */ 'setResults', /* results */ displayResults, /* replacement */ newState.replacement]
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

const renderReplaceExpanded = {
  isEqual(oldState, newState) {
    return oldState.replaceExpanded === newState.replaceExpanded
  },
  apply(oldState, newState) {
    return [/* method */ 'setReplaceExpanded', newState.replaceExpanded]
  },
}

const renderButtonsChecked = {
  isEqual(oldState, newState) {
    return (
      oldState.matchWholeWord === newState.matchWholeWord &&
      oldState.useRegularExpression === newState.useRegularExpression &&
      oldState.matchCase === newState.matchCase
    )
  },
  apply(oldState, newState) {
    return [/* method */ 'setButtonsChecked', newState.matchWholeWord, newState.useRegularExpression, newState.matchCase]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return (
      oldState.listFocusedIndex === newState.listFocusedIndex &&
      oldState.listFocused === newState.listFocused &&
      oldState.minLineY === newState.minLineY
    )
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.listFocusedIndex - oldState.minLineY
    const newFocusedIndex = newState.listFocusedIndex - newState.minLineY
    return [/* method */ 'setFocusedIndex', /* oldindex */ oldFocusedIndex, /* newIndex */ newFocusedIndex, /* focused */ newState.listFocused]
  },
}

export const render = [
  renderItems,
  renderMessage,
  renderValue,
  renderScrollBar,
  renderHeight,
  renderNegativeMargin,
  renderReplaceExpanded,
  renderButtonsChecked,
  renderFocusedIndex,
]
