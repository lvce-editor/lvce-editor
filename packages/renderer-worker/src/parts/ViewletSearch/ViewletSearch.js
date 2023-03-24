import * as Compare from '../Compare/Compare.js'
import * as Height from '../Height/Height.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
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
