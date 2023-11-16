export const state = {
  // TODO use numeric focus key
  currentFocus: '',
}

export const get = () => {
  return state.currentFocus
}

export const set = (value) => {
  state.currentFocus = value
}
