import * as BrowserHistory from '../BrowserHistory/BrowserHistory.js'

export const create = (id, uri) => {
  return {
    uid: id,
    uri,
    loaded: false,
    entries: [],
    searchValue: '',
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
  }
}

export const clearHistory = async (state) => {
  const entries = await BrowserHistory.clear()
  return {
    ...state,
    entries,
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
  }
}
