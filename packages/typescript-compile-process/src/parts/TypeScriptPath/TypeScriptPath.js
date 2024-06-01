const state = {
  typescriptPath: '',
}

export const get = () => {
  return state.typescriptPath
}

export const set = (value) => {
  state.typescriptPath = value
}
