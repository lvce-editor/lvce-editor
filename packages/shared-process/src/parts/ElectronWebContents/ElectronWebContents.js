import * as ElectronBrowserViewIpcState from '../ElectronBrowserViewIpcState/ElectronBrowserViewIpcState.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const dispose = async (id) => {
  await ParentIpc.invoke('ElectronWebContents.dispose', id)
}

export const handleKeyBinding = (id, keyBinding) => {
  console.log('keybinding')
}

export const handleWindowOpen = (webContentsId, url) => {
  // TODO
}

const forwardEvent = (method, webContentsId, ...params) => {
  const ipc = ElectronBrowserViewIpcState.get(webContentsId)
  if (!ipc) {
    console.log('no ipc', { webContentsId })
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
