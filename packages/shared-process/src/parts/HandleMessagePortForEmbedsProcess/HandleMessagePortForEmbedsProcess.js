import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'
import * as EmbedsProcessState from '../EmbedsProcessState/EmbedsProcessState.js'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForEmbedsProcess = (port, ipcId) => {
  EmbedsProcessState.increment()
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {
    ipcId,
  })
}

export const handleEmbedsProcessIpcClosed = async () => {
  EmbedsProcessState.decrement()
  if (EmbedsProcessState.get() === 0) {
    const promise = EmbedsProcess.state.ipc
    EmbedsProcess.state.ipc = undefined
    const ipc = await promise
    ipc.dispose()
  }
}
