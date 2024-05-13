import * as Assert from '../Assert/Assert.js'

const state = {
  views: Object.create(null),
  /**
   * @type {any[]}
   */
  fallThroughKeyBindings: [],
  canceled: Object.create(null),
}

export const add = (id, browserWindow, view) => {
  // state
  state.views[id] = { browserWindow, view }
}

export const hasWebContents = (id) => {
  Assert.number(id)
  return id in state.views
}
/**
 *
 * @param {number} id
 * @returns {{browserWindow: Electron.BrowserWindow, view: Electron.BrowserView}}
 */
export const get = (id) => {
  return state.views[id]
}

export const getAll = () => {
  return Object.values(state.views)
}

export const remove = (id) => {
  delete state.views[id]
}

export const getAnyKey = () => {
  const keys = Object.keys(state.views)
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
export const getWindow = (webContents) => {
  for (const value of Object.values(state.views)) {
    if (value.view.webContents === webContents) {
      return value.browserWindow
    }
  }
  return undefined
}

export const setFallthroughKeyBindings = (id, fallthroughKeyBindings) => {
  Assert.array(fallthroughKeyBindings)
  state.fallThroughKeyBindings = fallthroughKeyBindings
}

export const getFallthroughKeyBindings = () => {
  return state.fallThroughKeyBindings
}

export const isCanceled = (id) => {
  return id in state.canceled
}

export const removeCanceled = (id) => {
  delete state.canceled[id]
}

export const setCanceled = (id) => {
  state.canceled[id] = true
}
