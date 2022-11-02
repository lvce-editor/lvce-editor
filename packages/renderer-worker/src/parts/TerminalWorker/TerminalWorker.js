import * as Callback from '../Callback/Callback.js'
import * as TerminalWorkerIpc from '../TerminalWorkerIpc/TerminalWorkerIpc.js'

const handleMessage = (message) => {
  if ('id' in message) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(message.id, new Error(message.error))
    }
  }
}

export const create = async ({ method }) => {
  const ipc = await TerminalWorkerIpc.create({ method })
  ipc.onmessage = handleMessage
  return {
    send(message) {
      ipc.send(message)
    },
    sendAndTransfer(message, transfer) {
      ipc.sendAndTransfer(message, transfer)
    },
  }
}
