import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SerializeViewlet from '../SerializeViewlet/SerializeViewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const saveViewletState = async (id) => {
  const instance = ViewletStates.getInstance(id)
  const savedState = await SerializeViewlet.serializeInstance(instance)
  if (savedState === undefined) {
    return
  }
  await InstanceStorage.setJson(id, savedState)
  if (instance && instance.factory.saveChildState) {
    const childIds = instance.factory.saveChildState(instance.state)
    await Promise.all(childIds.map(saveViewletState))
  }
}

export const hydrate = async () => {
  // TODO should set up listener in renderer process
  if (!Preferences.get('workbench.saveStateOnVisibilityChange')) {
    console.info('[info] not saving state on visibility change - disabled by settings')
    return
  }
  await RendererProcess.invoke('Window.onVisibilityChange')
}

export const getSavedViewletState = (viewletId) => {
  return InstanceStorage.getJson(viewletId)
}

export * from '../HandleVisibilityChange/HandleVisibilityChange.js'
