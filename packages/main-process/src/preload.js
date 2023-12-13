const { ipcRenderer, contextBridge } = require('electron')

const ipcConnect = (message, transfer) => {
  console.log({ message, transfer })
  if (typeof message !== 'object') {
    throw new TypeError('[preload] message must be of type object')
  }
  if (Array.isArray(transfer)) {
    throw new TypeError('[preload] transfer must be of type array')
  }
  ipcRenderer.postMessage('port', message, transfer)
}

const handlePort = (event, message) => {
  console.log({ event, message })
  // @ts-ignore
  window.postMessage(message, location.origin)
}

const main = () => {
  ipcRenderer.on('port', handlePort)

  contextBridge.exposeInMainWorld('myApi', {
    ipcConnect,
  })
}

main()
