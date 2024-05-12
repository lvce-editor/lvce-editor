import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'

export const key = 'destroyed'

export const attach = (webContents, listener) => {
  webContents.on(ElectronWebContentsEventType.Destroyed, listener)
}

export const detach = (webContents, listener) => {
  webContents.off(ElectronWebContentsEventType.Destroyed, listener)
}

export const handler = () => {
  return {
    result: undefined,
    messages: [['handleBrowserViewDestroyed']],
  }
}
