import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const connectIpcToElectron = async (ipc) => {
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await JsonRpc.invokeAndTransfer(ipc, [port1], 'HandleElectronMessagePort.handleElectronMessagePort', /* isElectron */ true)
  await ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', [port2])
}
