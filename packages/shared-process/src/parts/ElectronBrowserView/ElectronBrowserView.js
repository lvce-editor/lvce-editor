import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'

export const createBrowserView = async (restoreId, fallthroughKeyBindings) => {
  const webContentsId = await ParentIpc.invoke('ElectronBrowserView.createBrowserView2', restoreId)
  // TODO get window id from renderer worker
  await ParentIpc.invoke('ElectronBrowserView.attachEventListeners', restoreId)
  return webContentsId
}

export const disposeBrowserView = async (id) => {
  ElectronBrowserViewState.remove(id)
  await ParentIpc.invoke('ElectronBrowserView.disposeBrowserView', id)
  await ParentIpc.invoke('ElectronWebContents.dispose', id)
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

export const handleKeyBinding = (id, keyBinding) => {
  console.log('keybinding')
}

export const handleWindowOpen = (webContentsId, url) => {
  // TODO
}

export const handleWillNavigate = (webContentsId, url) => {
  // TODO
}

export const handleDidNavigate = (webContentsId, url) => {
  // TODO
}

export const handleContextMenu = (webContentsId, params) => {
  // TODO
}

export const handlePageTitleUpdated = (webContentsId, title) => {
  // TODO
}
