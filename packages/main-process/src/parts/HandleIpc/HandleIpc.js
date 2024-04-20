import * as HandleMessage from '../HandleMessage/HandleMessage.js'

export const handleIpc = (ipc) => {
  ipc.on('message', HandleMessage.handleMessage)
}
