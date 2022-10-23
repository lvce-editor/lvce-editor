import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const state = {
  openCount: 0,
}

export const createBrowserView = (
  left,
  top,
  width,
  height,
  fallThroughKeyBindings
) => {
  state.openCount++
  return ElectronProcess.invoke(
    'ElectronBrowserView.createBrowserView',
    left,
    top,
    width,
    height,
    fallThroughKeyBindings
  )
}

export const disposeBrowserView = (id) => {
  state.openCount--
  return ElectronProcess.invoke('ElectronBrowserView.disposeBrowserView', id)
}

export const getOpenCount = () => {
  return state.openCount
}

export const isOpen = () => {
  return state.openCount > 0
}
