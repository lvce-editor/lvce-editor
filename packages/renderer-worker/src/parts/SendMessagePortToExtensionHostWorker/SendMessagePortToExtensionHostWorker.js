import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const sendMessagePortToExtensionHostWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ExtensionHostWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToSharedProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SharedProcess.invokeAndTransfer(initialCommand, port, rpcId)
}
