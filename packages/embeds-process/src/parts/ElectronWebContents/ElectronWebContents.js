import * as ElectronBrowserViewIpcState from '../ElectronWebContentsViewIpcState/ElectronWebContentsViewIpcState.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const dispose = async (id) => {
  await ParentIpc.invoke('ElectronWebContents.dispose', id)
}

export const callFunction = (webContentsId, method, ...params) => {
  return ParentIpc.invoke(`ElectronWebContents.callFunction`, webContentsId, method, ...params)
}

export const focus = (webContentsId) => {
  return callFunction(webContentsId, 'focus')
}

export const openDevtools = (webContentsId) => {
  return callFunction(webContentsId, 'openDevTools')
}

export const reload = (webContentsId) => {
  return callFunction(webContentsId, 'reload')
}

export const forward = (webContentsId) => {
  return callFunction(webContentsId, 'goForward')
}

export const backward = (webContentsId) => {
  return callFunction(webContentsId, 'goBack')
}

export const inspectElement = (webContentsId, x, y) => {
  return callFunction(webContentsId, `inspectElement`, x, y)
}

export const handleWindowOpen = (webContentsId, url) => {
  // TODO
}

const forwardEvent = (method, webContentsId, ...params) => {
  const ipc = ElectronBrowserViewIpcState.get(webContentsId)
  if (!ipc) {
    console.log(`[shared-process] no ipc for webcontents ${webContentsId}`)
    return
  }
  ipc.send({
    jsonrpc: '2.0',
    method: `SimpleBrowser.${method}`,
    params,
  })
}

export const handleWillNavigate = (...args) => {
  return forwardEvent('handleWillNavigate', ...args)
}

export const handleDidNavigate = (...args) => {
  return forwardEvent('handleDidNavigate', ...args)
}

export const handleContextMenu = (...args) => {
  return forwardEvent('handleContextMenu', ...args)
}

export const handleTitleUpdated = (...args) => {
  return forwardEvent('handleTitleUpdated', ...args)
}

export const handleKeyBinding = (...args) => {
  forwardEvent('handleKeyBinding', ...args)
}

export const handleBrowserViewDestroyed = (id) => {
  ElectronBrowserViewState.remove(id)
  ElectronBrowserViewIpcState.remove(id)
}
