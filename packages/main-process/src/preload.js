const { ipcRenderer, contextBridge } = require('electron')

const channelName = 'port'

const handleElectronMessage = (event, message) => {
  // @ts-ignore
  const { origin } = location
  // @ts-ignore
  window.postMessage(message, origin)
  ipcRenderer.off(channelName, handleElectronMessage)
}

const handleWindowMessage = (event) => {
  const { data, ports } = event
  ipcRenderer.postMessage(channelName, data, ports)
}

const main = () => {
  ipcRenderer.on(channelName, handleElectronMessage)
  // @ts-ignore
  window.addEventListener('message', handleWindowMessage, { once: true })
  contextBridge.exposeInMainWorld('isElectron', true)
}

main()
