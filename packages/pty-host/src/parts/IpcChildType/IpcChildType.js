export const WebSocket = 1
export const ChildProcess = 2
export const Worker = 3

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=websocket')) {
    return WebSocket
  }
  if (argv.includes('--ipc-type=parent')) {
    return ChildProcess
  }
  if (argv.includes('--ipc-type=worker')) {
    return Worker
  }
  throw new Error('[pty-host] unknown ipc type')
}
