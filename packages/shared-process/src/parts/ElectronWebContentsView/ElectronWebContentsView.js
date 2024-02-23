import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createWebContentsView = async (ipc, restoreId, fallthroughKeyBindings) => {
  const webContentsId = await ParentIpc.invoke('ElectronWebContentsView.createWebContentsView', restoreId)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronWebContentsView.attachEventListeners', webContentsId)
  return webContentsId
}

export const disposeWebContentsView = async (id) => {
  await ParentIpc.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  await ElectronWebContents.dispose(id)
}
