import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc: any) => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else {
    // deprecated
    ipc.onmessage = HandleMessage.handleMessage
  }
}
