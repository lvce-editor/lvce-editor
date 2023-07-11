export const NodeWorker = 1

export const Auto = () => {
  const { argv } = process
  if (argv.includes('--ipc-type=node-worker')) {
    return NodeWorker
  }
  throw new Error(`[babel-worker] unknown ipc type`)
}
