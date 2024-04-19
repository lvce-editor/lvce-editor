import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'

export const launchSharedProcessIpc = async () => {
  const ipc = await IpcParent.create({
    initialCommand: 'HandleElectronMessagePort.handleElectronMessagePort',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
