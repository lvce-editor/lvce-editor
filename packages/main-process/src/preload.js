const { ipcRenderer, contextBridge } = require('electron')

const ipcConnect = (message) => {
  if (typeof message !== 'object') {
    throw new TypeError('[preload] message must be of type object')
  }
  ipcRenderer.postMessage('port', message)
}

const handlePort = (event, message) => {
  if (event.ports.length === 1) {
    const port = event.ports[0]
    // @ts-ignore
    window.postMessage({ ...message, result: port }, '*', [port])
  } else {
    // @ts-ignore
    window.postMessage(message, '*')
  }
}

const main = () => {
  ipcRenderer.on('port', handlePort)

  contextBridge.exposeInMainWorld('myApi', {
    ipcConnect,
  })
}

main()
