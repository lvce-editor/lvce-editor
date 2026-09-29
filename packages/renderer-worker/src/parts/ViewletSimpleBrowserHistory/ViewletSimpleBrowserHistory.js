import * as BrowserHistory from '../BrowserHistory/BrowserHistory.js'

export const create = (id, uri) => {
  return {
    uid: id,
    uri,
    loaded: false,
    entries: [],
    searchValue: '',
    scrollTop: 0,
    viewportHeight: 1600,
  }
}

export const loadContent = async (state) => {
  const entries = await BrowserHistory.load()
  return {
    ...state,
    entries,
    loaded: true,
  }
}

export const handleInput = (state, value) => {
  return {
    ...state,
    searchValue: value,
    scrollTop: 0,
  }
}

export const handleScroll = (state, scrollTop, viewportHeight) => {
  if (state.scrollTop === scrollTop && state.viewportHeight === viewportHeight) {
    return state
  }
  return { ...state, scrollTop, viewportHeight }
}

export const clearHistory = async (state) => {
  const entries = await BrowserHistory.clear()
  return {
    ...state,
    entries,
    scrollTop: 0,
  }
}

export const removeEntry = async (state, index) => {
  const entry = state.entries[Number(index)]
  if (!entry) {
    return state
  }
  const entries = await BrowserHistory.removeEntry(entry)
  if (!entries) {
    return state
  }
  return {
    ...state,
    entries,
    scrollTop: 0,
  }
}
