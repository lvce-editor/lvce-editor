import * as Module from '../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.ts'

export const create = async (options: any) => {
  const rawIpc = await Module.create(options)
  const ipc = Module.wrap(rawIpc)
  return ipc
}
