import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc) => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else {
    ipc.onmessage = HandleMessage.handleMessage
  }
}
