import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await SharedProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}
