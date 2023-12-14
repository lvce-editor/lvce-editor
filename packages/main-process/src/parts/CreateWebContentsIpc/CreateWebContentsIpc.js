import * as ElectronPreloadChannelType from '../ElectronPreloadChannelType/ElectronPreloadChannelType.js'

export const createWebContentsIpc = (webContents) => {
  return {
    webContents,
    send(message) {
      this.webContents.postMessage(ElectronPreloadChannelType.Port, message)
    },
    sendAndTransfer(message, transfer) {
      this.webContents.postMessage(ElectronPreloadChannelType.Port, message, transfer)
    },
    isDisposed() {
      return this.webContents.isDestroyed()
    },
  }
}
