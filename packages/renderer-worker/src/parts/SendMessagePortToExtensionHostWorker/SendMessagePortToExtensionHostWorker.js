import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const sendMessagePortToExtensionHostWorker = async (port, initialCommand) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ExtensionHostWorker.invokeAndTransfer([port], initialCommand, port)
}
