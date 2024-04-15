import { ipcMain } from 'electron'

export const listen = () => {
  return ipcMain
}

const preloadChannelType = 'port'

const createSyntheticEvent = (event, message) => {
  const { sender, ports } = event
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
  const data = {
    ...message,
    params: [...message.params, ...ports],
  }
  const syntheticEvent = {
    target,
    data,
  }
  return syntheticEvent
}

export const wrap = (ipcMain) => {
  return {
    supportsTargetProperty: true,
    ipcMain,
    send(message) {
      throw new Error('not implemented')
    },
    set onmessage(listener) {
      const wrappedListener = (event, message) => {
        const syntheticEvent = createSyntheticEvent(event, message)
        listener(syntheticEvent)
      }
      this.ipcMain.on(preloadChannelType, wrappedListener)
    },
  }
}
