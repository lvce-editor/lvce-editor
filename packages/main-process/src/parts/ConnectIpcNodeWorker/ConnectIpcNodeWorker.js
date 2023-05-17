const { MessageChannel } = require('node:worker_threads')
const Performance = require('../Performance/Performance.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')
const TransferMessagePort = require('../TransferMessagePort/TransferMessagePort.js')

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
  await TransferMessagePort.transferMessagePort(sharedProcess, port1, folder)
  browserWindowPort.start()
}
