import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await SharedProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}

export const resizeWebContentsView = (id, x, y, width, height) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.resizeBrowserView', id, x, y, width, height)
}
