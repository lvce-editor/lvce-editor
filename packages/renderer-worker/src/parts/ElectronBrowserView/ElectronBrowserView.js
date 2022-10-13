import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const state = {
  openCount: 0,
}

export const createBrowserView = (
  url,
  left,
  top,
  width,
  height,
  fallThroughKeyBindings
) => {
  state.openCount++
  return ElectronProcess.invoke(
    'ElectronBrowserView.createBrowserView',
    url,
    left,
    top,
    width,
    height,
    fallThroughKeyBindings
  )
}

export const resizeBrowserView = (left, top, width, height) => {
  return ElectronProcess.invoke(
    'ElectronBrowserView.resizeBrowserView',
    left,
    top,
    width,
    height
  )
}

export const setIframeSrc = (iframeSrc) => {
  return ElectronProcess.invoke('ElectronBrowserView.setIframeSrc', iframeSrc)
}

export const openDevtools = () => {
  return ElectronProcess.invoke('ElectronBrowserView.openDevtools')
}

export const disposeBrowserView = () => {
  state.openCount--
  return ElectronProcess.invoke('ElectronBrowserView.disposeBrowserView')
}

export const getOpenCount = () => {
  return state.openCount
}

export const isOpen = () => {
  return state.openCount > 0
}
