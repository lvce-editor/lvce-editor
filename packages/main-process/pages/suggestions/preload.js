const { ipcRenderer } = require('electron')

const handlePort = (event) => {
  const port = event.ports[0]
  // console.log('[preload] got port', port)
  window.postMessage('abc', '*', [port])
}

ipcRenderer.on('port', handlePort)
