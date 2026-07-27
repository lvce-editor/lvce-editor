export const state = {
  currentFocus: 0,
}

export const get = () => {
  return state.currentFocus
}

export const set = (value) => {
  state.currentFocus = value
}
