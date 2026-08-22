import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.js'

const rpcs = Object.create(null)

export const createConnection = async (extensionId, rpcId) => {
  const connection = WebSocketCapability.create('extension-node-process')
  const url = new URL(connection.url)
  url.searchParams.set('extensionId', extensionId)
  url.searchParams.set('rpcId', rpcId)
  return {
    ...connection,
    url: url.toString(),
  }
}

export const supportsDirectConnection = () => true

export const createMessagePort = async (port, extensionId, rpcId) => {
  await SharedProcess.invokeAndTransfer('HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess', port, extensionId, rpcId)
}

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
