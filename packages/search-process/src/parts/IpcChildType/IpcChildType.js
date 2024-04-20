export const NodeWorker = 1
export const NodeForkedProcess = 2
export const ElectronUtilityProcess = 3
export const ElectronMessagePort = 4
export const NodeMessagePort = 5
export const WebSocket = 6

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
  throw new Error(`[shared-process] unknown ipc type`)
}
