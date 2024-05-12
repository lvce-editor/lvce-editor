import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'

export const key = 'context-menu'

export const attach = (webContents, listener) => {
  webContents.on(ElectronWebContentsEventType.ContextMenu, listener)
}

export const detach = (webContents, listener) => {
  webContents.off(ElectronWebContentsEventType.ContextMenu, listener)
}

export const handler = (event, params) => {
  return {
    result: undefined,
    messages: [['handleContextMenu', params]],
  }
}
