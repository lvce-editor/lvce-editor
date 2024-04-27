import * as HandleMessage from '../HandleMessage/HandleMessage.js'

export const handleIpcOnce = (ipc) => {
  ipc.addEventListener('message', HandleMessage.handleMessage, { once: true })
}
