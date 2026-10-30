import * as AuthProcess from '../AuthProcess/AuthProcess.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForAuthProcess = (port: any, ipcId: any): any => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.AuthProcess, port, { ipcId })
}

export const handleAuthProcessIpcClosed = (connectionId: string): void => {
  AuthProcess.release(connectionId)
}
