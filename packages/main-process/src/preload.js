const { ipcRenderer, contextBridge } = require('electron')

const channelName = 'port'

const handlePort = (event, message) => {
  // @ts-ignore
  const { origin } = location
  const { ports } = event
  if (ports.length === 1) {
    const port = ports[0]
    // @ts-ignore
    window.postMessage({ ...message, result: port }, origin, [port])
  } else {
    // @ts-ignore
    window.postMessage(message, origin)
  }
  ipcRenderer.off(channelName, handlePort)
}

const handleWindowMessage = (event) => {
  const { data, ports } = event
  ipcRenderer.postMessage(channelName, data, ports)
}

const main = () => {
  ipcRenderer.on(channelName, handlePort)
  // @ts-ignore
  window.addEventListener('message', handleWindowMessage, { once: true })
  contextBridge.exposeInMainWorld('isElectron', true)
}

main()
