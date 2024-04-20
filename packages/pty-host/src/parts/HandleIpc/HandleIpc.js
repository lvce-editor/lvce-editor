import * as Assert from '../Assert/Assert.js'
import * as HandleMessage from '../HandleMessage/HandleMessage.js'

export const handleIpc = (ipc) => {
  Assert.object(ipc)
  ipc.on('message', HandleMessage.handleMessage)
}
