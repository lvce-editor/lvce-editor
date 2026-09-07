import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const run = async (method, overlayId) => {
  const instances = new Set(ViewletStates.getValues())
  for (const instance of instances) {
    if (instance.moduleId !== ViewletModuleId.SimpleBrowser || !instance.factory.isVisible(instance.state)) {
      continue
    }
    try {
      await Viewlet.executeViewletCommand(instance.state.uid, method, overlayId)
    } catch (error) {
      console.error(`[renderer-worker] Failed to ${method} for Simple Browser`, error)
    }
  }
}

export const show = (overlayId) => {
  return run('showOverlay', overlayId)
}

export const hide = (overlayId) => {
  return run('hideOverlay', overlayId)
}
