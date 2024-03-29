import { MessageChannel } from 'node:worker_threads'
import * as TransferMessagePort from '../TransferMessagePort/TransferMessagePort.js'

export const connectIpc = async (ipc, browserWindowPort, ...params) => {
  const messageChannel = new MessageChannel()
  const { port1, port2 } = messageChannel
  browserWindowPort.on('message', (event) => {
    // console.log('got message from browser window', event.data)
    port2.postMessage(event.data)
  })
  port2.on('message', (message) => {
    // console.log('send message to browser window', message)
    browserWindowPort.postMessage(message)
  })
  await TransferMessagePort.transferMessagePort(ipc, port1, ...params)
  browserWindowPort.start()
}
