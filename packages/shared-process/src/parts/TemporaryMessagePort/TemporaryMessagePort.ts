import { VError } from '@lvce-editor/verror'
import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import { get } from '@lvce-editor/rpc-registry'

export const state: any = {
  ports: Object.create(null),
}

export const getPortTuple3 = async (id1: any, id2: any, rpcId: any): Promise<any> => {
  await ParentIpc.invoke('TemporaryMessagePort.createPortTuple', id1, id2)
  const port1 = state.ports[id1]
  const port2 = state.ports[id2]
  delete state.ports[id1]
  delete state.ports[id2]
  if (rpcId === IpcId.SharedProcess) {
    return {
      port1,
      port2,
    }
  }
  const ipc = get(rpcId)
  if (!ipc) {
    throw new Error('ipc not found' + rpcId)
  }
  await JsonRpc.invokeAndTransfer(ipc, 'TemporaryMessagePort.handlePorts', port1, port2, id1, id2)
  return {
    port1: undefined,
    port2: undefined,
  }
}

export const getPortTuple = async (): Promise<any> => {
  const id1 = Id.create()
  const id2 = Id.create()
  return getPortTuple3(id1, id2, IpcId.SharedProcess)
}

export const sendTo = async (name: any, port: any, ipcId: any): Promise<any> => {
  Assert.string(name)
  Assert.object(port)
  await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo', port, name, ipcId)
}

export const sendTo2 = async (port: any, targetRpcId: any, sourceIpcId: any): Promise<any> => {
  try {
    Assert.object(port)
    Assert.number(targetRpcId)
    await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo2', port, targetRpcId, sourceIpcId)
  } catch (error) {
    throw new VError(error, `Failed to send message port to electron utility process`)
  }
}

export const handlePorts = (port1: any, port2: any, id1: any, id2: any): any => {
  Assert.number(id1)
  Assert.number(id2)
  Assert.object(port1)
  Assert.object(port2)
  state.ports[id1] = port1
  state.ports[id2] = port2
}

export const sendToElectron = async (port: any, targetRpcId: any, sourceIpcId: any): Promise<any> => {
  try {
    Assert.object(port)
    Assert.number(targetRpcId)
    Assert.number(sourceIpcId)
    ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port, sourceIpcId)
  } catch (error) {
    throw new VError(error, `Failed to send message port to main process`)
  }
}
