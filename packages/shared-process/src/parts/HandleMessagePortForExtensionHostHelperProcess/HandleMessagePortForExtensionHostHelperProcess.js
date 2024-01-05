import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const handleMessagePortForExtensionHostHelperProcess = async (port) => {
  Assert.object(port)
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.ElectronUtilityProcess,
  })
  console.log({ port })
  await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
}
