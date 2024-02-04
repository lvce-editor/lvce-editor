import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'

export const createBrowserView = async (restoreId, fallthroughKeyBindings) => {
  const webContentsId = await ParentIpc.invoke('ElectronBrowserView.createBrowserView2', restoreId)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronBrowserView.attachEventListeners', restoreId)
  return webContentsId
}

export const disposeBrowserView = (id) => {
  ElectronBrowserViewState.remove(id)
  return ParentIpc.invoke('ElectronBrowserView.disposeBrowserView', id)
}

export const getAll = () => {
  return ParentIpc.invoke('ElectronBrowserView.getAll')
}

export const handleBrowserViewCreated = (id) => {
  console.log('created', id)
  ElectronBrowserViewState.add(id)
}

export const handleBrowserViewDestroyed = (id) => {
  ElectronBrowserViewState.remove(id)
}
