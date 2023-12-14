const { ipcRenderer, contextBridge } = require('electron')

const channelName = 'port'

const ipcConnect = (message) => {
  if (typeof message !== 'object') {
    throw new TypeError('[preload] message must be of type object')
  }
  ipcRenderer.postMessage(channelName, message)
}

const handlePort = (event, message) => {
  // @ts-ignore
  const { origin } = location
  if (event.ports.length === 1) {
    const port = event.ports[0]
    // @ts-ignore
    window.postMessage({ ...message, result: port }, origin, [port])
  } else {
    // @ts-ignore
    window.postMessage(message, origin)
  }
}

const handleWindowMessage = (event) => {
  const { data } = event
  if ('result' in data || 'error' in data) {
    return
  }
  ipcConnect(data)
}

const main = () => {
  ipcRenderer.on(channelName, handlePort)
  // @ts-ignore
  window.addEventListener('message', handleWindowMessage)

  contextBridge.exposeInMainWorld('isElectron', true)
}

console.log('hello from preload')

main()
