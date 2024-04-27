const { ipcRenderer, contextBridge } = require('electron')

const channelName = 'port'

const handleElectronMessage = (event, message) => {
  const { origin } = location
  window.postMessage(message, origin)
  ipcRenderer.off(channelName, handleElectronMessage)
}

const handleWindowMessage = (event) => {
  const { data, ports } = event
  ipcRenderer.on(channelName, handleElectronMessage)
  ipcRenderer.postMessage(channelName, data, ports)
}

const main = () => {
  window.addEventListener('message', handleWindowMessage, { once: true })
  contextBridge.exposeInMainWorld('isElectron', true)
}

main()
