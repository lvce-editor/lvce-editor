import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createWebContentsView = (restoreId, fallThroughKeyBindings) => {
  return SharedProcess.invoke('ElectronWebContentsView.createBrowserView', restoreId, fallThroughKeyBindings)
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeBrowserView', id)
}
