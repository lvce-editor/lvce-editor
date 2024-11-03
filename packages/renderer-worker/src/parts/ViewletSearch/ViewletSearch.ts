import * as Focus from '../Focus/Focus.js'
import * as GetSearchFocusKey from '../GetSearchFocusKey/GetSearchFocusKey.js'
import * as Height from '../Height/Height.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as ViewletSearchHandleUpdate from './ViewletSearchHandleUpdate.ts'
import type { SearchState } from './ViewletSearchTypes.ts'

export const create = (id: any, uri: string, x: number, y: number, width: number, height: number): SearchState => {
  return {
    uid: id,
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
      minimumSliderSize: MinimumSliderSize.minimumSliderSize,
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
    inputSource: InputSource.User,
    workspacePath: Workspace.state.workspacePath,
    includeValue: '',
    excludeValue: '',
    detailsExpanded: false,
    focus: WhenExpression.Empty,
    loaded: false,
    message: '',
    collapsedPaths: [],
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

const getSavedCollapsedPaths = (savedState) => {
  if (
    savedState &&
    'collapsedPaths' in savedState &&
    Array.isArray(savedState.collapsedPaths) &&
    savedState.collapsedPaths.every((path) => typeof path === 'string')
  ) {
    return savedState.collapsedPaths
  }
  return []
}

const getThreads = () => {
  const value = Preferences.get('search.threads')
  if (typeof value !== 'number' || value < 0 || value > 8) {
    return 0
  }
  return value
}

export const loadContent = async (state: SearchState, savedState: any): Promise<SearchState> => {
  const savedValue = getSavedValue(savedState)
  const savedReplaceExpanded = getSavedReplaceExpanded(savedState)
  const savedCollapsedPaths = getSavedCollapsedPaths(savedState)
  const threads = getThreads()
  if (savedValue) {
    return ViewletSearchHandleUpdate.handleUpdate(state, {
      value: savedValue,
      threads,
      replaceExpanded: savedReplaceExpanded,
      inputSource: InputSource.Script,
      collapsedPaths: savedCollapsedPaths,
    })
  }
  return {
    ...state,
    threads,
    replaceExpanded: savedReplaceExpanded,
    loaded: true,
  }
}

export const handleIconThemeChange = (state: SearchState): SearchState => {
  const { items } = state
  const newItems = [...items]
  return {
    ...state,
    items: newItems,
  }
}

export const dispose = async (state: SearchState) => {
  // TODO cancel pending search
  // @ts-ignore
  if (state.state === 'searching') {
    await TextSearch.cancel(state.searchId)
  }
  return {
    ...state,
    disposed: true,
  }
}

// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results

export const handleInput = (state: SearchState, value, inputSource = InputSource.Script) => {
  return ViewletSearchHandleUpdate.handleUpdate(state, { value, inputSource })
}

export const submit = (state: SearchState): Promise<SearchState> => {
  return ViewletSearchHandleUpdate.handleUpdate(state, { value: state.value, inputSource: InputSource.User })
}

export const focusSearchValue = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusSearchValue', state)
}

export const focusSearchValueNext = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusSearchValueNext', state)
}

export const focusMatchCasePrevious = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusMatchCasePrevious', state)
}

export const focusReplaceValuePrevious = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusReplaceValuePrevious', state)
}

export const focusReplaceValueNext = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusReplaceValueNext', state)
}

export const focusRegexNext = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusRegexNext', state)
}

export const focusPreserveCasePrevious = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusPreserveCasePrevious', state)
}

export const focusReplaceValue = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusReplaceValue', state)
}

export const focusMatchCase = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusMatchCase', state)
}

export const focusPreserveCase = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusPreserveCase', state)
}

export const focusMatchWholeWord = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusMatchWholeWord', state)
}

export const focusRegex = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusRegex', state)
}

export const focusReplaceAll = (state: SearchState): Promise<SearchState> => {
  return TextSearchWorker.invoke('TextSearch.focusReplaceAll', state)
}

export const handleFocusIn = (state: SearchState, key: any) => {
  const focusKey = GetSearchFocusKey.getSearchFocusKey(key)
  Focus.setFocus(focusKey)
  return {
    ...state,
    focus: focusKey,
  }
}
