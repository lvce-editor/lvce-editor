import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createBrowserView = (restoreId, fallthroughKeyBindings) => {
  return ParentIpc.invoke('ElectronBrowserView.createBrowserView', restoreId, fallthroughKeyBindings)
}

export const disposeBrowserView = (id) => {
  return ParentIpc.invoke('ElectronBrowserView.disposeBrowserView', id)
}
