import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

const terminalProcessInitialCommand = 'HandleMessagePortForTerminalProcess.handleMessagePortForTerminalProcess'

export const sendMessagePortToElectron = async (port, initialCommand, ipcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  if (initialCommand === terminalProcessInitialCommand && (await WorkspaceConnection.connectMessagePort('terminal-process', port))) {
    return
  }
  await SharedProcess.invokeAndTransfer(initialCommand, port, ipcId)
}
