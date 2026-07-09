import * as AuthProcess from '../AuthProcess/AuthProcess.ts'
import * as AuthProcessState from '../AuthProcessState/AuthProcessState.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForAuthProcess = (port: any, ipcId: any): any => {
  AuthProcessState.increment()
  return HandleIncomingIpc.handleIncomingIpc(IpcId.AuthProcess, port, {
    ipcId,
  })
}

export const handleAuthProcessIpcClosed = async (): Promise<any> => {
  AuthProcessState.decrement()
  if (AuthProcessState.hasRef()) {
    return
  }
  const promise = AuthProcess.state.ipc
  AuthProcess.state.ipc = undefined
  const ipc = await promise
  ipc.dispose()
}
