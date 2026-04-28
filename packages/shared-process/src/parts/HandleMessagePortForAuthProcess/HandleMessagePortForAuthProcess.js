import * as AuthProcess from '../AuthProcess/AuthProcess.js'
import * as AuthProcessState from '../AuthProcessState/AuthProcessState.js'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForAuthProcess = (port, ipcId) => {
  AuthProcessState.increment()
  return HandleIncomingIpc.handleIncomingIpc(IpcId.AuthProcess, port, {
    ipcId,
  })
}

export const handleAuthProcessIpcClosed = async () => {
  AuthProcessState.decrement()
  if (AuthProcessState.hasRef()) {
    return
  }
  const promise = AuthProcess.state.ipc
  AuthProcess.state.ipc = undefined
  const ipc = await promise
  ipc.dispose()
}
