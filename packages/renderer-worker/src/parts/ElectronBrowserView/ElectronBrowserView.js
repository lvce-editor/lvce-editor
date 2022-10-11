import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const createBrowserView = (url, left, top, width, height) => {
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
