import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const sendMessagePortToMainProcess = async (port, initialCommand, ipcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  Assert.number(ipcId)
  await SharedProcess.invokeAndTransfer('SendMessagePortToMainProcess.sendMessagePortToMainProcess', port, initialCommand, ipcId)
}
