const { ipcRenderer, contextBridge } = require('electron')

const ipcConnect = (type) => {
  // const channel = new MessageChannel()
  // const { port1, port2 } = channel
  // ipcRenderer.postMessage('port', type, [port1])
  // // @ts-ignore
  // window.postMessage('abc', '*', [port2])
}

const handlePort = (event) => {
  const port = event.ports[0]
  console.log('[preload] got port', port)
  window.postMessage('abc', '*', [port])
}

ipcRenderer.on('port', handlePort)
contextBridge.exposeInMainWorld('myApi', {
  ipcConnect,
})
