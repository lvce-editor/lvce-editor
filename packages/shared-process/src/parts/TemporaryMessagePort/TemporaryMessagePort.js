import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const state = {
  ports: Object.create(null),
}

export const getPortTuple = async () => {
  const id1 = Id.create()
  const id2 = Id.create()
  await ParentIpc.invoke('TemporaryMessagePort.createPortTuple', id1, id2)
  const port1 = state.ports[id1]
  const port2 = state.ports[id2]
  delete state.ports[id1]
  delete state.ports[id2]
  return {
    port1,
    port2,
  }
}

export const sendTo = async (name, port, ipcId) => {
  Assert.string(name)
  Assert.object(port)
  await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo', port, name, ipcId)
}

export const sendTo2 = async (port, targetRpcId, sourceIpcId) => {
  Assert.object(port)
  Assert.number(targetRpcId)
  Assert.number(sourceIpcId)
  await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo2', port, targetRpcId, sourceIpcId)
}

export const handlePorts = (port1, port2, id1, id2) => {
  Assert.number(id1)
  Assert.number(id2)
  Assert.object(port1)
  Assert.object(port2)
  state.ports[id1] = port1
  state.ports[id2] = port2
}
