import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

const x = (a) => {
  console.log({ a })
  return HandleMessage.handleMessage(a)
}

export const handleIpcOnce = (ipc) => {
  if (ipc.addEventListener) {
    ipc.addEventListener('message', x, { once: true })
  } else {
    // deprecated
    ipc.onmessage = x
  }
}
