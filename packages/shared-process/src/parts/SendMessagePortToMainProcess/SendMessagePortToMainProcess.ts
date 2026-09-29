import * as Assert from '../Assert/Assert.ts'
import * as MainProcess from '../MainProcess/MainProcess.ts'

export const sendMessagePortToMainProcess = async (port: any, initialCommand: string, ipcId: number): Promise<void> => {
  Assert.object(port)
  Assert.string(initialCommand)
  Assert.number(ipcId)
  await MainProcess.invokeAndTransfer(initialCommand, port, ipcId)
}
