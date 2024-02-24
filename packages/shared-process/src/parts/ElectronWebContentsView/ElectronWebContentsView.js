import * as ElectronBrowserViewIpcState from '../ElectronBrowserViewIpcState/ElectronBrowserViewIpcState.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Assert from '../Assert/Assert.js'

export const createWebContentsView = async (ipc, restoreId, fallthroughKeyBindings) => {
  Assert.object(ipc)
  Assert.number(restoreId)
  const webContentsId = await ParentIpc.invoke('ElectronWebContentsView.createWebContentsView', restoreId)
  ElectronBrowserViewIpcState.add(webContentsId, ipc)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronWebContentsView.attachEventListeners', webContentsId)
  await ParentIpc.invoke('ElectronWebContentsViewFunctions.setBackgroundColor', webContentsId, 'white')
  return webContentsId
}

export const disposeWebContentsView = async (id) => {
  await ParentIpc.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  await ElectronWebContents.dispose(id)
}
