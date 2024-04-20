import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Assert from '../Assert/Assert.js'
import * as Id from '../Id/Id.js'

export const state = {
  ports: Object.create(null),
}

export const create = async (name) => {
  Assert.string(name)
  await ParentIpc.invoke('TemporaryMessagePort.create', name)
  const port = state.ports[name]
  if (!port) {
    throw new Error(`port was not created`)
  }
  delete state.ports[name]
  port.start()
  return port
}

export const getPortTuple = async () => {
  const id1 = `${Id.create()}`
  const id2 = `${Id.create()}`
  await ParentIpc.invoke('TemporaryMessagePort.createPortTuple', id1, id2)
  const port1 = state.ports[id1]
  const port2 = state.ports[id2]
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

export const handlePort = (port, name) => {
  Assert.string(name)
  Assert.object(port)
  state.ports[name] = port
}
