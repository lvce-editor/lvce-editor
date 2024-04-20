import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const launchEmbedsProcess = async () => {
  const embedsProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: EmbedsProcessPath.embedsProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Embeds Process',
  })
  HandleIpc.handleIpc(embedsProcess)
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await JsonRpc.invokeAndTransfer(embedsProcess, [port1], 'HandleElectronMessagePort.handleElectronMessagePort')
  await ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', [port2])
  return embedsProcess
}
