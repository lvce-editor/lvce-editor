export const NodeWorker = 1
export const NodeForkedProcess = 2

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=node-worker')) {
    return NodeWorker
  }
  if (argv.includes('--ipc-type=node-forked-process')) {
    return NodeForkedProcess
  }
  throw new Error(`[pty-host] unknown ipc type`)
}
