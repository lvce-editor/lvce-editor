import { BrowserWindow, ipcMain } from 'electron'

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
  // TODO compute browser window id in renderer process or preload script?
  const browserWindow = BrowserWindow.fromWebContents(event.sender)
  if (!browserWindow) {
    throw new Error('no browser window found')
  }
  const browserWindowId = browserWindow.id
  const data = {
    ...message,
    params: [...message.params, ...ports, browserWindowId],
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
    on(event, listener) {
      const wrappedListener = (event, message) => {
        const syntheticEvent = createSyntheticEvent(event, message)
        listener(syntheticEvent)
      }
      this.ipcMain.on(preloadChannelType, wrappedListener)
    },
  }
}
