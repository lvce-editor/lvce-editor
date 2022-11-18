export const WebSocket = 1
export const MessagePort = 2
export const Parent = 3

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=websocket')) {
    return WebSocket
  }
  if (argv.includes('--ipc-type=message-port')) {
    return MessagePort
  }
  if (argv.includes('--ipc-type=parent')) {
    return Parent
  }
  throw new Error('[extension-host-helper-process] unknown ipc type')
}
