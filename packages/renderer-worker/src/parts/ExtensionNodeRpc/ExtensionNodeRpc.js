import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const rpcs = Object.create(null)

const getRpc = (id) => {
  const rpc = rpcs[id]
  if (!rpc) {
    throw new Error(`node rpc ${id} not found`)
  }
  return rpc
}

export const create = async (name, path) => {
  const id = Id.create()
  const rpc = await IpcParent.create({
    initialCommand: 'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
    method: IpcParentType.NodeAlternate,
    name,
    type: 'extension-host-helper-process',
  })
  HandleIpc.handleIpc(rpc)
  await JsonRpc.invoke(rpc, 'LoadFile.loadFile', path)
  rpcs[id] = rpc
  return id
}

export const invoke = async (id, method, ...params) => {
  return JsonRpc.invoke(getRpc(id), method, ...params)
}

export const dispose = (id) => {
  const rpc = getRpc(id)
  delete rpcs[id]
  rpc.dispose()
}
