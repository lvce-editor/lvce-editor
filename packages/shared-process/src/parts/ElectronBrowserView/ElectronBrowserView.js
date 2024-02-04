import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'

export const createBrowserView = async (restoreId, fallthroughKeyBindings) => {
  // const webContentsId = await ParentIpc.invoke('ElectronBrowserView.createBrowserView2')
  // return webContentsId

  return ParentIpc.invoke('ElectronBrowserView.createBrowserView', restoreId, fallthroughKeyBindings)
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
