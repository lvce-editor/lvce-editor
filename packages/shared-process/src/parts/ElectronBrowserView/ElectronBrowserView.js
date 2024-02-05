import * as ElectronBrowserViewIpcState from '../ElectronBrowserViewIpcState/ElectronBrowserViewIpcState.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createBrowserView = async (ipc, restoreId, fallthroughKeyBindings) => {
  const webContentsId = await ParentIpc.invoke('ElectronBrowserView.createBrowserView2', restoreId)
  ElectronBrowserViewIpcState.add(webContentsId, ipc)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronBrowserView.attachEventListeners', webContentsId)
  await ParentIpc.invoke('ElectronBrowserViewFunctions.setBackgroundColor', webContentsId, 'white')
  return webContentsId
}

export const disposeBrowserView = async (id) => {
  ElectronBrowserViewState.remove(id)
  await ParentIpc.invoke('ElectronBrowserView.disposeBrowserView', id)
  await ElectronWebContents.dispose(id)
}

export const handleBrowserViewCreated = (id) => {
  console.log('created', id)
  ElectronBrowserViewState.add(id)
}
