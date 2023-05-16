const { MessageChannel } = require('node:worker_threads')
const Callback = require('../Callback/Callback.js')
const Performance = require('../Performance/Performance.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')

exports.connectIpc = async (sharedProcess, browserWindowPort, folder = '') => {
  const messageChannel = new MessageChannel()
  const { port1 } = messageChannel
  const { port2 } = messageChannel
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
  browserWindowPort.on('message', (event) => {
    // console.log('got message from browser window', event.data)
    port2.postMessage(event.data)
  })
  port2.on('message', (message) => {
    // console.log('send message to browser window', message)
    browserWindowPort.postMessage(message)
  })
  const { id, promise } = Callback.registerPromise()
  // TODO use jsonrpc.invoke
  sharedProcess.sendAndTransfer(
    {
      jsonrpc: '2.0',
      method: 'ElectronInitialize.electronInitialize',
      id,
      params: [port1, folder],
    },
    [port1]
  )
  await promise
  browserWindowPort.start()
}
