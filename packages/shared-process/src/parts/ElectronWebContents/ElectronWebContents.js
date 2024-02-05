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

export const handleWillNavigate = (webContentsId, url) => {
  console.log('will navigate', url)
  // TODO
}

export const handleDidNavigate = (webContentsId, url) => {
  console.log('did navigate', url)
  // TODO
}

export const handleContextMenu = (webContentsId, params) => {
  // TODO
}

export const handleTitleUpdated = (webContentsId, title) => {
  // TODO
}
