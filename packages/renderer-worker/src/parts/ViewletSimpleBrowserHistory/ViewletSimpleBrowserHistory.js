export const create = (id, uri) => {
  return {
    uid: id,
    uri,
    loaded: false,
    searchValue: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    loaded: true,
  }
}

export const handleInput = (state, value) => {
  return {
    ...state,
    searchValue: value,
  }
}

export const clearHistory = (state) => {
  return state
}
