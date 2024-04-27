const { ipcRenderer, contextBridge } = require('electron')

const channelName = 'port'

const handleElectronMessage = (event, message) => {
  // @ts-ignore
  const { origin } = location
  // @ts-ignore
  window.postMessage(message, origin)
}

const handleWindowMessage = (event) => {
  const { data, ports } = event
  ipcRenderer.once(channelName, handleElectronMessage)
  ipcRenderer.postMessage(channelName, data, ports)
}

const main = () => {
  // @ts-ignore
  window.addEventListener('message', handleWindowMessage, { once: true })
  contextBridge.exposeInMainWorld('isElectron', true)
}

main()
