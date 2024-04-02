import * as Assert from '../Assert/Assert.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const sendMessagePortToElectron = async (port, initialCommand) => {
  Assert.object(port)
  Assert.string(initialCommand)
  const ipc = SharedProcessState.state.ipc
  await JsonRpc.invokeAndTransfer(ipc, [port], initialCommand)
}
