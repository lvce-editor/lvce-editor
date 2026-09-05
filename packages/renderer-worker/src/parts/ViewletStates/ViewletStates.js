import * as Assert from '../Assert/Assert.ts'
import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'

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

const listeners = new Set()

const emit = (type, instance) => {
  for (const listener of listeners) {
    listener(type, instance)
  }
}

export const addListener = (listener) => {
  listeners.add(listener)
}

const normalizeModuleId = (key) => {
  if (key === 'Editor') {
    return 'EditorText'
  }
  if (key === 'EditorText') {
    return 'Editor'
  }
  if (key === 'EditorCompletion') {
    return 'Editor'
  }
  return key
}

const getFocusedInstanceForModuleId = (moduleId, applicationId) => {
  const focusedUid = getFocusedInstanceByType(moduleId, applicationId)
  if (typeof focusedUid !== 'number') {
    return undefined
  }
  const instance = getByUid(focusedUid)
  return belongsToApplication(instance, applicationId) ? instance : undefined
}

export const set = (key, value) => {
  // TODO separate factories from state
  Assert.object(value)
  Assert.object(value.factory)
  Assert.object(value.state)
  Assert.object(value.renderedState)
  const uid = value.renderedState.uid
  const applicationId = value.state.applicationId ?? ApplicationRegistry.getOwner(uid)
  if (applicationId !== undefined) {
    ApplicationRegistry.own(applicationId, uid)
  }
  state.instances[key] = value
  emit('add', value)
}

export const getByUid = (uid) => {
  for (const value of Object.values(state.instances)) {
    if (value.renderedState.uid === uid) {
      return value
    }
  }
  return undefined
}

const belongsToApplication = (instance, applicationId) => {
  return instance && (applicationId === undefined || ApplicationRegistry.getOwner(instance.renderedState.uid) === applicationId)
}

export const getInstance = (key, applicationId = undefined) => {
  const fast = state.instances[key]
  if (belongsToApplication(fast, applicationId)) {
    return fast
  }
  if (typeof key === 'number') {
    const byUid = getByUid(key)
    if (belongsToApplication(byUid, applicationId)) {
      return byUid
    }
  }
  const normalizedKey = normalizeModuleId(key)
  if (normalizedKey !== key) {
    const normalizedFast = state.instances[normalizedKey]
    if (belongsToApplication(normalizedFast, applicationId)) {
      return normalizedFast
    }
  }
  const focusedInstance = getFocusedInstanceForModuleId(key, applicationId) || getFocusedInstanceForModuleId(normalizedKey, applicationId)
  if (focusedInstance) {
    return focusedInstance
  }
  for (const value of Object.values(state.instances)) {
    if (belongsToApplication(value, applicationId) && (value.moduleId === key || value.moduleId === normalizedKey)) {
      return value
    }
  }
  return undefined
}

export const hasInstance = (key) => {
  return key in state.instances
}

export const remove = (key) => {
  const instance = state.instances[key]
  delete state.instances[key]
  if (instance) {
    clearFocusedInstanceByType(instance.renderedState?.uid, instance.moduleId)
    if (!Object.values(state.instances).includes(instance)) {
      emit('remove', instance)
    }
  }
}

export const dispose = async (key) => {
  const instance = state.instances[key]
  delete state.instances[key]
  if (instance) {
    clearFocusedInstanceByType(instance.renderedState?.uid, instance.moduleId)
    if (!Object.values(state.instances).includes(instance)) {
      emit('remove', instance)
    }
  }
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

export const getState = (key, applicationId = undefined) => {
  const instance = getInstance(key, applicationId)
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
  emit('render', instance)
}

export const reset = () => {
  for (const instance of new Set(Object.values(state.instances))) {
    emit('remove', instance)
  }
  state.instances = Object.create(null)
  state.focusedInstanceByType = Object.create(null)
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
  const applicationId = ApplicationRegistry.getOwner(uid)
  if (applicationId !== undefined) {
    state.focusedInstanceByType[JSON.stringify([applicationId, moduleId])] = uid
  }
}

/**
 * Get the focused instance UID for a given module type
 * @param {string} moduleId - The module ID/type
 * @returns {number|undefined} The UID of the focused instance, or undefined
 */
export const getFocusedInstanceByType = (moduleId, applicationId = undefined) => {
  const key = applicationId === undefined ? moduleId : JSON.stringify([applicationId, moduleId])
  return state.focusedInstanceByType[key]
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
  const applicationId = ApplicationRegistry.getOwner(uid)
  const key = JSON.stringify([applicationId, moduleId])
  if (state.focusedInstanceByType[key] === uid) {
    delete state.focusedInstanceByType[key]
  }
}
