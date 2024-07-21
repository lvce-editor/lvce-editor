import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc: any) => {
  ipc.addEventListener('message', HandleMessage.handleMessage)
}
