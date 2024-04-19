import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'

export const launchEmbedsProcessIpc = async () => {
  const ipc = await IpcParent.create({
    initialCommand: 'HandleElectronMessagePortForEmbedsProcess.handleElectronMessagePortForEmbedsProcess',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
