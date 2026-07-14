import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const isVisible = () => {
  const simpleBrowserInstance = ViewletStates.getInstance(ViewletModuleId.SimpleBrowser)
  const mainInstance = ViewletStates.getInstance(ViewletModuleId.Main)
  if (!simpleBrowserInstance || !mainInstance) {
    return false
  }
  const { groups } = mainInstance.state
  const simpleBrowserUid = simpleBrowserInstance.state.uid
  return groups.some((group) => group.editors[group.activeIndex]?.uid === simpleBrowserUid)
}

const run = async (method, overlayId) => {
  if (!isVisible()) {
    return
  }
  try {
    await Command.execute(`SimpleBrowser.${method}`, overlayId)
  } catch (error) {
    console.error(`[renderer-worker] Failed to ${method} for Simple Browser`, error)
  }
}

export const show = (overlayId) => {
  return run('showOverlay', overlayId)
}

export const hide = (overlayId) => {
  return run('hideOverlay', overlayId)
}
