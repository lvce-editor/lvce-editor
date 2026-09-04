import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getUid = (instance) => instance.state?.uid ?? instance.renderedState?.uid

const isWorkerBacked = (instance) => Boolean(instance.factory?.hasFunctionalRender)

const isEditable = (instance) => {
  if (!isWorkerBacked(instance)) {
    return true
  }
  return typeof instance.factory.getComponentState === 'function' && typeof instance.factory.setComponentState === 'function'
}

const getInstance = (uid) => {
  const instance = ViewletStates.getByUid(uid)
  if (!instance) {
    throw new Error(`Component not found: ${uid}`)
  }
  return instance
}

export const getComponents = () => {
  const seen = new Set()
  const components = []
  for (const instance of ViewletStates.getValues()) {
    const uid = getUid(instance)
    if (typeof uid !== 'number' || seen.has(uid)) {
      continue
    }
    seen.add(uid)
    components.push({
      editable: isEditable(instance),
      moduleId: instance.moduleId || instance.factory?.name || 'Unknown',
      uid,
    })
  }
  return components.sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.uid - b.uid)
}

export const getState = async (uid) => {
  const instance = getInstance(uid)
  if (isWorkerBacked(instance)) {
    if (typeof instance.factory.getComponentState !== 'function') {
      throw new Error(`Component state API not available: ${instance.moduleId}`)
    }
    return instance.factory.getComponentState(instance.state)
  }
  return instance.state
}

const validateState = (uid, oldState, newState) => {
  if (!newState || typeof newState !== 'object' || Array.isArray(newState)) {
    throw new TypeError('Component state must be an object')
  }
  if (typeof oldState.uid === 'number' && newState.uid !== oldState.uid) {
    throw new Error(`Component state uid must remain ${uid}`)
  }
}

const renderState = async (instance, uid, newState) => {
  const commands = ViewletManager.render(instance.factory, instance.renderedState, newState, uid, newState.parentUid)
  ViewletStates.setRenderedState(uid, newState)
  if (commands.length > 0) {
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }
}

export const setState = async (uid, newComponentState) => {
  const instance = getInstance(uid)
  const oldComponentState = await getState(uid)
  validateState(uid, oldComponentState, newComponentState)
  if (isWorkerBacked(instance)) {
    if (typeof instance.factory.setComponentState !== 'function') {
      throw new Error(`Component state API not available: ${instance.moduleId}`)
    }
    const newRendererState = await instance.factory.setComponentState(instance.state, newComponentState)
    await renderState(instance, uid, newRendererState)
    return
  }
  await renderState(instance, uid, newComponentState)
}
