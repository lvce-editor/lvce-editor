import * as Assert from '../Assert/Assert.js'

export const state = {
  instances: Object.create(null),
}

export const set = (key, value) => {
  Assert.object(value)
  Assert.object(value.factory)
  Assert.object(value.state)

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

export const setState = (key, newState) => {
  const instance = getInstance(key)
  instance.state = newState
}

export const reset = () => {
  state.instances = Object.create(null)
}
