import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const state = {
  openCount: 0,
}

export const createBrowserView = (restoreId, fallThroughKeyBindings) => {
  state.openCount++
  return ElectronProcess.invoke(
    'ElectronBrowserView.createBrowserView',
    restoreId,
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
