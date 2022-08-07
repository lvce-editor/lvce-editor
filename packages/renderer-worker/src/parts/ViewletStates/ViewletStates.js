export const state = {
  instances: Object.create(null),
}

export const set = (key, value) => {
  state.instances[key] = value
}

export const getInstance = (key) => {
  return state.instances[key]
}

export const remove = (key) => {
  delete state.instances[key]
}

export const getAllInstances = () => {
  return state.instances
}

export const getState = (key) => {
  const instance = getInstance(key)
  return instance.state
}

export const reset = () => {
  state.instances = Object.create(null)
}
