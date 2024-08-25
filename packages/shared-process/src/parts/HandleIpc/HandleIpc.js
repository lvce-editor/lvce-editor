import * as HandleMessage from '../HandleMessage/HandleMessage.js'

const handled = new WeakSet()

export const handleIpc = (ipc) => {
  if (handled.has(ipc)) {
    return
  }
  handled.add(ipc)
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else if ('on' in ipc) {
    // deprecated
    ipc.on('message', HandleMessage.handleMessage)
  }
}

export const unhandleIpc = (ipc) => {
  handled.delete(ipc)
  if ('removeEventListener' in ipc) {
    ipc.removeEventListener('message', HandleMessage.handleMessage)
  } else if ('off' in ipc) {
    // deprecated
    ipc.off('message', HandleMessage.handleMessage)
  }
}
