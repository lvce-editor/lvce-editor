import * as Assert from '../Assert/Assert.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.js'

export const handleMessagePortForProcessExplorer = async (port) => {
  Assert.object(port)
  const ipc = await ProcessExplorer.getOrCreate()
  await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
}
