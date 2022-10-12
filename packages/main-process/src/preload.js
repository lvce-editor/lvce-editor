const { ipcRenderer, contextBridge } = require('electron')

const ipcConnect = (type) => {
  if (typeof type !== 'string') {
    throw new Error('[preload] type must be of type string')
  }
  // renderer.js ///////////////////////////////////////////////////////////////
  // MessagePorts are created in pairs. A connected pair of message ports is
  // called a channel.
  // @ts-ignore
  const channel = new MessageChannel()

  // The only difference between port1 and port2 is in how you use them. Messages
  // sent to port1 will be received by port2 and vice-versa.
  const { port1, port2 } = channel

  // Here we send the other end of the channel, port1, to the main process. It's
  // also possible to send MessagePorts to other frames, or to Web Workers, etc.
  ipcRenderer.postMessage('port', type, [port1])

  // @ts-ignore
  window.postMessage('abc', '*', [port2])
}

// const handleQuickPickMessage = (...args) => {
// console.log({ args })
// }

const main = () => {
  // ipcRenderer.on('quickpick-message', handleQuickPickMessage)

  contextBridge.exposeInMainWorld('myApi', {
    ipcConnect,
  })
}

main()
