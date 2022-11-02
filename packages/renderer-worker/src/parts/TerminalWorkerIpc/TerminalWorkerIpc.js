import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = async ({ method }) => {
  const url = new URL(
    '../../../../terminal-worker/src/terminalWorkerMain.js',
    import.meta.url
  ).toString()
  const worker = await IpcParent.create({
    method,
    url,
    name: 'Terminal Worker',
  })
  return worker
}
