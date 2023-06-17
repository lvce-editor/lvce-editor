export const state = {
  isMaximized: false,
  isMinimized: false,
}

export const setMaximized = (value) => {
  state.isMaximized = value
}

export const setMinimized = (value) => {
  state.isMinimized = value
}

export const isMaximized = () => {
  return state.isMaximized
}
