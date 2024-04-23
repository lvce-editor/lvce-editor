import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const sendMessagePortToElectron = async (port, initialCommand, ipcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SharedProcess.invokeAndTransfer([port], initialCommand, ipcId)
}
