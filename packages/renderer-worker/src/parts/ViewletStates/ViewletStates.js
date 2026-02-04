import * as Assert from '../Assert/Assert.ts'

// TODO instances should be keyed by numeric id
// to allow having multiple instances of the same
// type. for example multiple editors

export const state = {
  instances: Object.create(null),
  /**
   * @type {any}
   */
  focusedInstance: undefined,
  /**
   * Track focused instance by module ID/type
   * Allows commands to target the focused viewlet of a given type
   * @type {Object<string, number>}
   */
  focusedInstanceByType: Object.create(null),
}

export const set = (key, value) => {
  // TODO separate factories from state
  Assert.object(value)
  Assert.object(value.factory)
  Assert.object(value.state)
  Assert.object(value.renderedState)
  state.instances[key] = value
}

export const getByUid = (uid) => {
  for (const value of Object.values(state.instances)) {
    if (value.renderedState.uid === uid) {
      return value
    }
  }
  return undefined
}

export const getInstance = (key) => {
  const fast = state.instances[key]
  if (fast) {
    return fast
  }
  if (key === 'Editor') {
    key = 'EditorText'
  }
  if (key === 'EditorText') {
    key = 'Editor'
  }
  if (key === 'EditorCompletion') {
    key = 'Editor'
  }
  for (const value of Object.values(state.instances)) {
    if (value.moduleId === key) {
      return value
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

export const getValues = () => {
  return Object.values(state.instances)
}

export const hasState = (key) => {
  const instance = getInstance(key)
  return Boolean(instance)
}

export const getState = (key) => {
  const instance = getInstance(key)
  if (!instance) {
    throw new Error(`instance not found ${key}`)
  }
  return instance.state
}

export const setState = (key, newState) => {
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw new TypeError('key must be defined')
  }
  Assert.object(newState)
  const instance = getInstance(key)
  instance.state = newState
}

export const setRenderedState = (key, newState) => {
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw new TypeError('key must be defined')
  }
  Assert.object(newState)
  const instance = getInstance(key)
  if (!instance) {
    return
  }
  instance.renderedState = newState
  instance.state = newState
}

export const reset = () => {
  state.instances = Object.create(null)
}

export const getFocusedInstance = () => {
  return state.focusedInstance
}

/**
 * Set the focused viewlet instance for a given module type
 * @param {number} uid - The UID of the instance
 * @param {string} moduleId - The module ID/type (e.g., 'EditorText', 'Explorer')
 */
export const setFocusedInstanceByType = (uid, moduleId) => {
  if (typeof uid !== 'number') {
    return
  }
  if (typeof moduleId !== 'string') {
    return
  }
  state.focusedInstanceByType[moduleId] = uid
}

/**
 * Get the focused instance UID for a given module type
 * @param {string} moduleId - The module ID/type
 * @returns {number|undefined} The UID of the focused instance, or undefined
 */
export const getFocusedInstanceByType = (moduleId) => {
  return state.focusedInstanceByType[moduleId]
}

/**
 * Clear the focused instance for a given module type (e.g., when viewlet is disposed)
 * @param {number} uid - The UID of the instance
 * @param {string} moduleId - The module ID/type
 */
export const clearFocusedInstanceByType = (uid, moduleId) => {
  if (state.focusedInstanceByType[moduleId] === uid) {
    delete state.focusedInstanceByType[moduleId]
  }
}
