const {
  ipcRenderer,
  webFrame,
  contextBridge,
  MessageChannelMain,
} = require('electron')

const ipcConnect = () => {
  // renderer.js ///////////////////////////////////////////////////////////////
  // MessagePorts are created in pairs. A connected pair of message ports is
  // called a channel.
  const channel = new MessageChannel()

  // The only difference between port1 and port2 is in how you use them. Messages
  // sent to port1 will be received by port2 and vice-versa.
  const port1 = channel.port1
  const port2 = channel.port2

  // Here we send the other end of the channel, port1, to the main process. It's
  // also possible to send MessagePorts to other frames, or to Web Workers, etc.
  ipcRenderer.postMessage('port', null, [port1])

  window.postMessage('abc', '*', [port2])
}

contextBridge.exposeInMainWorld('myApi', {
  ipcConnect,
})
