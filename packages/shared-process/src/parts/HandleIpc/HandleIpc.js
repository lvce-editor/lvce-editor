import * as HandleMessage from '../HandleMessage/HandleMessage.js'

export const handleIpc = (ipc) => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else if ('on' in ipc) {
    // deprecated
    ipc.on('message', HandleMessage.handleMessage)
  }
}

export const unhandleIpc = (ipc) => {
  if ('removeEventListener' in ipc) {
    ipc.removeEventListener('message', HandleMessage.handleMessage)
  } else if ('off' in ipc) {
    // deprecated
    ipc.off('message', HandleMessage.handleMessage)
  }
}
