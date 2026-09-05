import * as GetViewletStorageKey from '../GetViewletStorageKey/GetViewletStorageKey.js'
import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveWorkspaceViewletStates from '../SaveWorkspaceViewletStates/SaveWorkspaceViewletStates.js'
import * as SerializeViewlet from '../SerializeViewlet/SerializeViewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const getStorageKey = (viewletId) => {
  return GetViewletStorageKey.getViewletStorageKey(viewletId, Workspace.getWorkspaceUri())
}

const saveViewletStateAs = async (instanceId, storageId) => {
  const instance = ViewletStates.getInstance(instanceId)
  const applicationId = ApplicationRegistry.getOwner(instance?.state.uid)
  const savedState = await SerializeViewlet.serializeInstance(instance)
  if (savedState === undefined) {
    return
  }
  if (applicationId !== undefined && ApplicationRegistry.getOwner(instance.state.uid) !== applicationId) {
    return
  }
  if (applicationId === undefined) {
    await InstanceStorage.setJson(getStorageKey(storageId), savedState)
  } else {
    ApplicationRegistry.setSavedState(applicationId, storageId, savedState)
  }
  if (instance && instance.factory.saveChildState) {
    const childIds = instance.factory.saveChildState(instance.state)
    await Promise.all(childIds.map(saveViewletState))
  }
}

export const saveViewletState = async (id) => {
  const instance = ViewletStates.getInstance(id)
  const storageId = instance?.factory.getStorageKey ? instance.factory.getStorageKey(instance.state) : id
  return saveViewletStateAs(id, storageId)
}

export const saveViewletStateWithStorageId = async (instanceId, storageId) => {
  return saveViewletStateAs(instanceId, storageId)
}

export const hydrate = async () => {
  GlobalEventBus.addListener('workspace.beforeChange', SaveWorkspaceViewletStates.saveWorkspaceViewletStates)
  // TODO should set up listener in renderer process
  if (!Preferences.get('workbench.saveStateOnVisibilityChange')) {
    console.info('[info] not saving state on visibility change - disabled by settings')
    return
  }
  await RendererProcess.invoke('Window.onVisibilityChange')
}

/**
 * @param {string | number} viewletId
 * @param {string=} applicationId
 * @returns {Promise<any>}
 */
export const getSavedViewletState = async (viewletId, applicationId = undefined) => {
  if (applicationId !== undefined) {
    return ApplicationRegistry.getSavedState(applicationId, viewletId)
  }
  return InstanceStorage.getJson(getStorageKey(viewletId))
}

export * from '../HandleVisibilityChange/HandleVisibilityChange.js'
