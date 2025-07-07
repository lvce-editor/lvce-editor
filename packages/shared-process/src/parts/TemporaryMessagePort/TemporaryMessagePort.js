import { VError } from '@lvce-editor/verror'
import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import { get } from '@lvce-editor/rpc-registry'

export const state = {
  ports: Object.create(null),
}

export const getPortTuple3 = async (id1, id2, rpcId) => {
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

export const getPortTuple = async () => {
  const id1 = Id.create()
  const id2 = Id.create()
  return getPortTuple3(id1, id2, IpcId.SharedProcess)
}

export const sendTo = async (name, port, ipcId) => {
  Assert.string(name)
  Assert.object(port)
  await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo', port, name, ipcId)
}

export const sendTo2 = async (port, targetRpcId, sourceIpcId) => {
  try {
    Assert.object(port)
    Assert.number(targetRpcId)
    await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo2', port, targetRpcId, sourceIpcId)
  } catch (error) {
    throw new VError(error, `Failed to send message port to electron utility process`)
  }
}

export const handlePorts = (port1, port2, id1, id2) => {
  Assert.number(id1)
  Assert.number(id2)
  Assert.object(port1)
  Assert.object(port2)
  state.ports[id1] = port1
  state.ports[id2] = port2
}

export const sendToElectron = async (port, targetRpcId, sourceIpcId) => {
  try {
    Assert.object(port)
    Assert.number(targetRpcId)
    Assert.number(sourceIpcId)
    ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port, sourceIpcId)
  } catch (error) {
    throw new VError(error, `Failed to send message port to main process`)
  }
}
