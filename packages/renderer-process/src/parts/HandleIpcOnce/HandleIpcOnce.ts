import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpcOnce = (ipc) => {
  if (ipc.addEventListener) {
    ipc.addEventListener('message', HandleMessage.handleMessage, { once: true })
  } else {
    // deprecated
    ipc.onmessage = HandleMessage.handleMessage
  }
}
