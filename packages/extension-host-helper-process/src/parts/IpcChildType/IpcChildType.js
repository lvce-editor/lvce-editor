export const WebSocket = 1
export const MessagePort = 2

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=websocket')) {
    return WebSocket
  }
  if (argv.includes('--ipc-type=message-port')) {
    return MessagePort
  }
  throw new Error('[extension-host-helper-process] unknown ipc type')
}
