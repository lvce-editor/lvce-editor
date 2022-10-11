import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const state = {
  openCount: 0,
}

export const createBrowserView = (url, left, top, width, height) => {
  state.openCount++
  return ElectronProcess.invoke(
    'ElectronBrowserView.createBrowserView',
    url,
    left,
    top,
    width,
    height
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

export const openDevtools = () => {
  return ElectronProcess.invoke('ElectronBrowserView.openDevtools')
}

export const disposeBrowserView = () => {
  state.openCount--
  return ElectronProcess.invoke('ElectronBrowserView.disposeBrowserView')
}

export const createBrowserViewQuickPick = (top, left, width, height) => {
  return ElectronProcess.invoke(
    'ElectronBrowserView.createBrowserViewQuickPick',
    top,
    left,
    width,
    height
  )
}

export const sendQuickPickItems = (items) => {
  return ElectronProcess.invoke('ElectronBrowserView.setQuickPickItems', items)
}

export const getOpenCount = () => {
  return state.openCount
}

export const isOpen = () => {
  return state.openCount > 0
}

export const setQuickPickValue = (value) => {
  return ElectronProcess.invoke('ElectronBrowserView.setQuickPickValue', value)
}
