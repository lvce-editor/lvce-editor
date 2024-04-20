import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'

export const launchEmbedsProcessIpc = async () => {
  const ipc = await IpcParent.create({
    initialCommand: 'HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
