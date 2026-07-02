const state = {
  config: {},
}

export const set = (config) => {
  state.config = config || {}
}

export const get = (key) => {
  return state.config[key] || ''
}

export const reset = () => {
  state.config = {}
}
