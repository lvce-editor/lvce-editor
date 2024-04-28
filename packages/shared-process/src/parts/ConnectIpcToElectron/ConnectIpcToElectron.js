import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const connectIpcToElectron = async (ipc, ipcId = IpcId.Unknown) => {
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, [port1], 'HandleElectronMessagePort.handleElectronMessagePort', IpcId.MainProcess),
    ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', [port2], ipcId),
  ])
}
