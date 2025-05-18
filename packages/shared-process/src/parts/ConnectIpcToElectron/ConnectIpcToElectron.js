import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

export const connectIpcToElectron = async (ipc, ipcId = IpcId.Unknown) => {
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'HandleElectronMessagePort.handleElectronMessagePort', port1, IpcId.MainProcess),
    ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port2, ipcId),
  ])
}

export const connectIpcToMainProcess2 = async (ipc, ipcId = IpcId.Unknown) => {
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'Initialize.initialize', port1),
    ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port2, ipcId),
  ])
}
