export const state = Object.create(null)

export const setAll = async (preferences) => {
  Object.assign(state, preferences)
}

export const get = (key) => {
  return state[key]
}
export const getMany = (keys) => {
  return keys.map(get)
}

export const getAll = () => {
  return state
}

export const set = async (key, value) => {
  state[key] = value
}
