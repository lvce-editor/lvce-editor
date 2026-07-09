import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.ts'
import * as EmbedsProcessState from '../EmbedsProcessState/EmbedsProcessState.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForEmbedsProcess = (port: any, ipcId: any): any => {
  EmbedsProcessState.increment()
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {
    ipcId,
  })
}

export const handleEmbedsProcessIpcClosed = async (): Promise<any> => {
  EmbedsProcessState.decrement()
  if (EmbedsProcessState.hasRef()) {
    return
  }
  const promise = EmbedsProcess.state.ipc
  EmbedsProcess.state.ipc = undefined
  const ipc = await promise
  ipc.dispose()
}
