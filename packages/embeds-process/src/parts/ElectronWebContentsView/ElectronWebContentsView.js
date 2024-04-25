import * as Assert from '../Assert/Assert.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'
import * as ElectronWebContentsViewIpcState from '../ElectronWebContentsViewIpcState/ElectronWebContentsViewIpcState.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const createWebContentsView = async (ipc, restoreId, fallthroughKeyBindings) => {
  Assert.number(restoreId)
  const webContentsId = await ParentIpc.invoke('ElectronWebContentsView.createWebContentsView', restoreId)
  ElectronWebContentsViewIpcState.add(webContentsId, ipc)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronWebContentsView.attachEventListeners', webContentsId)
  await ParentIpc.invoke('ElectronWebContentsViewFunctions.setBackgroundColor', webContentsId, 'white')
  return webContentsId
}

export const disposeWebContentsView = async (id) => {
  await ParentIpc.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  await ElectronWebContents.dispose(id)
}

export const resizeWebContentsView = async (id, ...args) => {
  return ParentIpc.invoke('ElectronWebContentsViewFunctions.resizeBrowserView', id, ...args)
}

export const setIframeSrc = async (id, ...args) => {
  return ParentIpc.invoke('ElectronWebContentsViewFunctions.setIframeSrc', id, ...args)
}

export const getStats = async (id, ...args) => {
  return ParentIpc.invoke('ElectronWebContentsViewFunctions.getStats', id, ...args)
}

export const show = async (id, ...args) => {
  return ParentIpc.invoke('ElectronWebContentsViewFunctions.show', id, ...args)
}

const forwardIpcEvent =
  (key) =>
  (id, ...args) => {
    const ipc = ElectronWebContentsViewIpcState.get(id)
    if (!ipc) {
      return
    }
    JsonRpc.send(ipc, key, id, ...args)
  }

export const handleDidNavigate = forwardIpcEvent('ElectronWebContentsView.handleDidNavigate')

export const handleTitleUpdated = forwardIpcEvent('ElectronWebContentsView.handleTitleUpdated')

export const handleWillNavigate = forwardIpcEvent('ElectronWebContentsView.handleWillNavigate')

export const handleContextMenu = forwardIpcEvent('ElectronWebContentsView.handleContextMenu')

export const handleBrowserViewDestroyed = (id, ...args) => {
  // TODO send to embeds worker?
}
