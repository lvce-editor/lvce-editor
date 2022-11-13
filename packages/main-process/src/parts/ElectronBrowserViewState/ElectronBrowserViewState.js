const state = {
  browserViews: Object.create(null),
  fallThroughKeyBindings: [],
}

exports.add = (id, browserWindow, view) => {
  // state
  state.browserViews[id] = { browserWindow, view }
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
  return parseInt(keys[0])
}

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
