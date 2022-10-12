const { ipcRenderer, contextBridge } = require('electron')

const handleMessage = (method, ...params) =>
  ipcRenderer.send('QuickPick.handleMessage', {
    jsonrpc: '2.0',
    method,
    params,
  })

contextBridge.exposeInMainWorld('electronApi', {
  handleMessage,
})
