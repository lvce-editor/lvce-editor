export const NodeWorker = 1
export const NodeForkedProcess = 2
export const WebSocket = 3
export const ElectronUtilityProcess = 4
export const ElectronMessagePort = 5
export const NodeMessagePort = 6

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=node-worker')) {
    return NodeWorker
  }
  if (argv.includes('--ipc-type=node-forked-process')) {
    return NodeForkedProcess
  }
  if (argv.includes('--ipc-type=electron-utility-process')) {
    return ElectronUtilityProcess
  }
  throw new Error(`[pty-host] unknown ipc type`)
}
