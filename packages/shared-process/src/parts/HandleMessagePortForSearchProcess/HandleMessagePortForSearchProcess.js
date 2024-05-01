import * as Assert from '../Assert/Assert.js'
import * as SearchProcess from '../SearchProcess/SearchProcess.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

// TODO use handleIncomingIpc function
export const handleMessagePortForSearchProcess = async (port) => {
  Assert.object(port)
  const ipc = await SearchProcess.getOrCreate()
  await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
}
