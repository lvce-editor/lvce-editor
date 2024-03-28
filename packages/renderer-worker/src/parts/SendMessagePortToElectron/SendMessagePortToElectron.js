import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const sendMessagePortToElectron = async (port, initialCommand) => {
  const ipc = SharedProcessState.state.ipc
  await JsonRpc.invokeAndTransfer(ipc, [port], initialCommand || 'HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess')
}
