import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc) => {
  ipc.addEventListener('message', HandleMessage.handleMessage)
}
