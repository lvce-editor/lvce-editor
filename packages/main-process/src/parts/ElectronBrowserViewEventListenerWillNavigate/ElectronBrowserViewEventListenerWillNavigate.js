import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'

export const key = 'will-navigate'

export const attach = (webContents, listener) => {
  webContents.on(ElectronWebContentsEventType.WillNavigate, listener)
}

export const detach = (webContents, listener) => {
  webContents.off(ElectronWebContentsEventType.WillNavigate, listener)
}

export const handler = (event, url) => {
  return {
    result: undefined,
    messages: [['handleWillNavigate', url]],
  }
}
