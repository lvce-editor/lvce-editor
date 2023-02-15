import * as Assert from '../Assert/Assert.js'

export const state = {
  instances: Object.create(null),
  /**
   * @type {any}
   */
  focusedInstance: undefined,
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

export const getAFocusedInstance = (key) => {
  const { instances } = state
  if (instances[key]) {
    return instances[key]
  }
  for (const instance of Object.values(instances)) {
    if (instance.factory.name === key && instance.state.focused) {
      return instance
    }
  }
  return undefined
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
  if (!instance) {
    throw new Error(`instance not found ${key}`)
  }
  return instance.state
}

export const setState = (key, newState) => {
  if (!key) {
    throw new Error(`[setState] key must be defined but is ${key}`)
  }
  Assert.object(newState)
  const instance = getInstance(key)
  if (!instance) {
    throw new Error(`instance ${key} not found`)
  }
  instance.state = newState
}

export const reset = () => {
  state.instances = Object.create(null)
}

export const getFocusedInstance = () => {
  return state.focusedInstance
}

export const setFocusedInstance = (state, instance) => {
  state.focusedIndex = instance
}
