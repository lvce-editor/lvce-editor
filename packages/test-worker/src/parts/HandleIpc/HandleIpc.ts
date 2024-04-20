import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc) => {
  ipc.onmessage = HandleMessage.handleMessage
}
