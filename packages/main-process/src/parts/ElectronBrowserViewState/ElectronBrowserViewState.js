const Assert = require('../Assert/Assert.js')

const state = {
  browserViews: Object.create(null),
  fallThroughKeyBindings: [],
  canceled: Object.create(null),
}

exports.add = (id, browserWindow, view) => {
  // state
  state.browserViews[id] = { browserWindow, view }
}

exports.hasWebContents = (id) => {
  Assert.number(id)
  return id in state.browserViews
}
/**
 *
 * @param {number} id
 * @returns {{browserWindow: Electron.BrowserWindow, view: Electron.BrowserView}}
 */
exports.get = (id) => {
  return state.browserViews[id]
}

exports.getAll = () => {
  return Object.values(state.browserViews)
}

exports.remove = (id) => {
  delete state.browserViews[id]
}

exports.getAnyKey = () => {
  const keys = Object.keys(state.browserViews)
  if (keys.length === 0) {
    throw new Error('no browser view found')
  }
  return Number.parseInt(keys[0])
}

/**
 *
 * @param {import('electron').WebContents} webContents
 * @returns {import('electron').BrowserView|undefined}
 */
exports.getWindow = (webContents) => {
  for (const value of Object.values(state.browserViews)) {
    if (value.view.webContents === webContents) {
      return value.browserWindow
    }
  }
  return undefined
}

exports.setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  state.fallThroughKeyBindings = fallthroughKeyBindings
}

exports.isCanceled = (id) => {
  return id in state.canceled
}

exports.removeCanceled = (id) => {
  delete state.canceled[id]
}

exports.setCanceled = (id) => {
  state.canceled[id] = true
}
