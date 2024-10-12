import * as Focus from '../Focus/Focus.js'
import * as GetSearchFocusKey from '../GetSearchFocusKey/GetSearchFocusKey.js'
import * as Height from '../Height/Height.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TextSearch from '../TextSearch/TextSearch.js'
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

export const focusSearchValue = (state: SearchState): SearchState => {
  return {
    ...state,
    focus: WhenExpression.FocusSearchInput,
  }
}

export const focusSearchValueNext = (state: SearchState): SearchState => {
  const { replaceExpanded } = state
  if (replaceExpanded) {
    return focusReplaceValue(state)
  }
  return focusMatchCase(state)
}

export const focusMatchCasePrevious = (state: SearchState): SearchState => {
  const { replaceExpanded } = state
  if (replaceExpanded) {
    return focusReplaceValue(state)
  }
  return focusSearchValue(state)
}

export const focusReplaceValuePrevious = (state: SearchState): SearchState => {
  return focusSearchValue(state)
}

export const focusReplaceValueNext = (state: SearchState): SearchState => {
  return focusMatchCase(state)
}

export const focusRegexNext = (state: SearchState): SearchState => {
  return focusPreserveCase(state)
}

export const focusPreserveCasePrevious = (state: SearchState): SearchState => {
  return focusRegex(state)
}

export const focusReplaceValue = (state: SearchState): SearchState => {
  return {
    ...state,
    focus: WhenExpression.FocusSearchReplaceInput,
  }
}

export const focusMatchCase = (state: SearchState): SearchState => {
  return { ...state, focus: WhenExpression.FocusSearchMatchCase }
}

export const focusPreserveCase = (state: SearchState): SearchState => {
  return { ...state, focus: WhenExpression.FocusSearchPreserveCase }
}

export const focusMatchWholeWord = (state: SearchState): SearchState => {
  return { ...state, focus: WhenExpression.FocusSearchWholeWord }
}

export const focusRegex = (state: SearchState): SearchState => {
  return { ...state, focus: WhenExpression.FocusSearchRegex }
}

export const focusReplaceAll = (state: SearchState): SearchState => {
  return { ...state, focus: WhenExpression.FocusSearchReplaceAll }
}

export const handleFocusIn = (state: SearchState, key: any) => {
  const focusKey = GetSearchFocusKey.getSearchFocusKey(key)
  Focus.setFocus(focusKey)
  return {
    ...state,
    focus: focusKey,
  }
}
