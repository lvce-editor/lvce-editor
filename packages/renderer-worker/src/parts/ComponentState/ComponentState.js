import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const liveComponentStatePattern = /^live-component-state:\/\/\/(\d+(?:\.\d+)?)\.json$/
const editorUidsByComponentUid = new Map()
const componentUidByEditorUid = new Map()
const mainEditorUidsAwaitingInitialRefresh = new Set()
const refreshes = new Map()

const getUid = (instance) => instance.state?.uid ?? instance.renderedState?.uid

const getLiveComponentUid = (instance) => {
  const uri = instance.state?.uri
  if (typeof uri !== 'string') {
    return undefined
  }
  const match = liveComponentStatePattern.exec(uri)
  return match ? Number(match[1]) : undefined
}

const subscribe = (instance) => {
  const componentUid = getLiveComponentUid(instance)
  const editorUid = getUid(instance)
  if (componentUid === undefined || typeof editorUid !== 'number') {
    return
  }
  editorUidsByComponentUid.set(componentUid, editorUidsByComponentUid.get(componentUid)?.add(editorUid) || new Set([editorUid]))
  componentUidByEditorUid.set(editorUid, componentUid)
  if (ViewletStates.getByUid(componentUid)?.moduleId === 'Main') {
    mainEditorUidsAwaitingInitialRefresh.add(editorUid)
  }
}

const unsubscribeEditor = (editorUid) => {
  const componentUid = componentUidByEditorUid.get(editorUid)
  if (componentUid === undefined) {
    return
  }
  componentUidByEditorUid.delete(editorUid)
  mainEditorUidsAwaitingInitialRefresh.delete(editorUid)
  const editorUids = editorUidsByComponentUid.get(componentUid)
  editorUids?.delete(editorUid)
  if (editorUids?.size === 0) {
    editorUidsByComponentUid.delete(componentUid)
  }
}

const unsubscribeComponent = (componentUid) => {
  const editorUids = editorUidsByComponentUid.get(componentUid)
  if (!editorUids) {
    return
  }
  editorUidsByComponentUid.delete(componentUid)
  for (const editorUid of editorUids) {
    componentUidByEditorUid.delete(editorUid)
    mainEditorUidsAwaitingInitialRefresh.delete(editorUid)
  }
}

const getEditorTabStates = async () => {
  const mainInstance = ViewletStates.getInstance('Main')
  if (!mainInstance || typeof mainInstance.factory.getComponentState !== 'function') {
    return new Map()
  }
  const mainState = await mainInstance.factory.getComponentState(mainInstance.state)
  const groups = mainState?.layout?.groups
  if (!Array.isArray(groups)) {
    return new Map()
  }
  const editorTabStates = new Map()
  for (const group of groups) {
    for (const tab of group.tabs || []) {
      if (typeof tab.editorUid === 'number') {
        editorTabStates.set(tab.editorUid, {
          active: Boolean(group.focused && group.activeTabId === tab.id),
          dirty: Boolean(tab.isDirty),
        })
      }
    }
  }
  return editorTabStates
}

const runRefreshes = async (componentUid, refresh) => {
  try {
    while (refresh.pending) {
      refresh.pending = false
      const editorUids = [...(editorUidsByComponentUid.get(componentUid) || [])]
      const editorTabStates = await getEditorTabStates()
      const isMainComponent = ViewletStates.getByUid(componentUid)?.moduleId === 'Main'
      const editorUidsToRefresh = editorUids.filter((editorUid) => {
        if (mainEditorUidsAwaitingInitialRefresh.has(editorUid)) {
          return true
        }
        const tabState = editorTabStates.get(editorUid)
        return !tabState?.dirty && !(isMainComponent && tabState?.active)
      })
      await Promise.allSettled(editorUidsToRefresh.map((editorUid) => Viewlet.reload(editorUid)))
      for (const editorUid of editorUidsToRefresh) {
        mainEditorUidsAwaitingInitialRefresh.delete(editorUid)
      }
    }
  } finally {
    refreshes.delete(componentUid)
  }
}

export const refreshOpenEditors = (componentUid) => {
  const existingRefresh = refreshes.get(componentUid)
  if (existingRefresh) {
    existingRefresh.pending = true
    return existingRefresh.promise
  }
  const refresh = {
    pending: true,
    promise: Promise.resolve(),
  }
  refreshes.set(componentUid, refresh)
  refresh.promise = runRefreshes(componentUid, refresh)
  return refresh.promise
}

export const waitForRefreshes = async () => {
  while (refreshes.size > 0) {
    await Promise.all([...refreshes.values()].map((refresh) => refresh.promise))
  }
}

const handleViewletStateChange = (type, instance) => {
  const uid = getUid(instance)
  if (typeof uid !== 'number') {
    return
  }
  if (type === 'add') {
    subscribe(instance)
    return
  }
  if (type === 'remove') {
    unsubscribeEditor(uid)
    unsubscribeComponent(uid)
    return
  }
  if (type === 'render' && editorUidsByComponentUid.has(uid)) {
    void refreshOpenEditors(uid)
  }
}

ViewletStates.addListener(handleViewletStateChange)
for (const instance of ViewletStates.getValues()) {
  subscribe(instance)
}

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
