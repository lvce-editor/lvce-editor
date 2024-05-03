import * as HandleMessage from '../HandleMessage/HandleMessage.js'

export const handleIpc = (ipc) => {
  ipc.addEventListener('message', HandleMessage.handleMessage)
}
