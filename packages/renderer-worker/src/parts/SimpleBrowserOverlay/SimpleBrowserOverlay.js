import * as Command from '../Command/Command.js'

const run = async (method, overlayId) => {
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
