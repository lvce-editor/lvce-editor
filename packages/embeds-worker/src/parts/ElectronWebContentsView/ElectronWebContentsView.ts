import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  return SharedProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}
