import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc) => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else {
    // deprevated
    ipc.onmessage = HandleMessage.handleMessage
  }
}

export const unhandleIpc = (ipc) => {
  if ('removeEventListener' in ipc) {
    ipc.removeEventListener('message', HandleMessage.handleMessage)
  } else {
    // deprecated
    ipc.onmessage = null
  }
}
