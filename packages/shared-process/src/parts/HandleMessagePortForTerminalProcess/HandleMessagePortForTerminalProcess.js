import * as Assert from '../Assert/Assert.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PtyHost from '../PtyHost/PtyHost.js'

export const handleMessagePortForTerminalProcess = async (port) => {
  Assert.object(port)
  const ptyHost = await PtyHost.getOrCreate(IpcParentType.ElectronUtilityProcess)
  await JsonRpc.invokeAndTransfer(ptyHost, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
}
