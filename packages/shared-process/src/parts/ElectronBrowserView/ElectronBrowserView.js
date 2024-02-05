import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createBrowserView = async (restoreId, fallthroughKeyBindings) => {
  const webContentsId = await ParentIpc.invoke('ElectronBrowserView.createBrowserView2', restoreId)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronBrowserView.attachEventListeners', webContentsId)
  return webContentsId
}

export const disposeBrowserView = async (id) => {
  ElectronBrowserViewState.remove(id)
  await ParentIpc.invoke('ElectronBrowserView.disposeBrowserView', id)
  await ElectronWebContents.dispose(id)
}

export const getAll = () => {
  return ParentIpc.invoke('ElectronBrowserView.getAll')
}

export const handleBrowserViewCreated = (id) => {
  console.log('created', id)
  ElectronBrowserViewState.add(id)
}

export const handleBrowserViewDestroyed = (id) => {
  console.log('destroyed', id)
  ElectronBrowserViewState.remove(id)
}
