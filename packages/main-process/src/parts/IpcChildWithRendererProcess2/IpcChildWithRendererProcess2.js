import { BrowserWindow } from 'electron'

export const listen = ({ webContentsIpc }) => {
  return webContentsIpc
}

const preloadChannelType = 'port'

const createSyntheticEvent = (event, message) => {
  const { sender, ports } = event
  const data = {
    ...message,
    params: [...message.params, ...ports],
  }
  const target = {
    sender,
    sendAndTransfer(message, transfer) {
      this.sender.postMessage(preloadChannelType, message, transfer)
    },
    send(message) {
      this.sender.postMessage(preloadChannelType, message)
    },
    isDiposed() {
      return this.sender.isDestroyed()
    },
  }
  const syntheticEvent = {
    data,
    target,
  }
  return syntheticEvent
}

export const wrap = (webContentsIpc) => {
  return {
    webContentsIpc,
    send(message) {
      throw new Error('not implemented')
    },
    on(event, listener) {
      const wrappedListener = (event, message) => {
        const syntheticEvent = createSyntheticEvent(event, message)
        listener(syntheticEvent)
      }
      this.webContentsIpc.on(preloadChannelType, wrappedListener)
    },
  }
}
