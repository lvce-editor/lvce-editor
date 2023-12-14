import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Assert from '../Assert/Assert.js'

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

export const handlePort = (port, name) => {
  Assert.string(name)
  Assert.object(port)
  state.ports[name] = port
}
