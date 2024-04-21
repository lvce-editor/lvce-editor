import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'

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

export const sendTo = async (name, port) => {
  Assert.string(name)
  Assert.object(port)
  await ParentIpc.invokeAndTransfer('TemporaryMessagePort.sendTo', [port], name)
}

/**
 * @deprecated
 */
export const handlePort = (port, name) => {
  Assert.number(name)
  Assert.object(port)
  state.ports[name] = port
}

export const handlePorts = (port1, port2, id1, id2) => {
  Assert.number(id1)
  Assert.number(id2)
  state.ports[port1] = port1
  state.ports[port2] = port2
}
