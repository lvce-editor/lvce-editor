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

export const hasInstance = (key) => {
  return key in state.instances
}

export const remove = (key) => {
  delete state.instances[key]
}

export const dispose = async (key) => {
  const instance = state.instances[key]
  delete state.instances[key]
  if (instance.factory.dispose) {
    await instance.factory.dispose(instance.state)
  }
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
