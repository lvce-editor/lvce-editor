import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IpcParentWithNodeAlternate from '../IpcParentWithNodeAlternate/IpcParentWithNodeAlternate.js'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ReconnectingWebSocket from '../ReconnectingWebSocket/ReconnectingWebSocket.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.js'

const rpcs = Object.create(null)

const createRpc = (ipc, dispose) => {
  HandleIpc.handleIpc(ipc)
  return {
    dispose,
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}

export const supportsDirectConnection = () => true

export const createConnection = async (extensionId, rpcId, path) => {
  const connectionInfo = await SharedProcess.invoke('WebSocketCapability.createExtensionNodeRpc', extensionId, rpcId, path)
  return WebSocketCapability.resolveConnectionInfo(connectionInfo)
}

export const createMessagePort = async (port, path) => {
  await SharedProcess.invokeAndTransfer(
    'HandleMessagePortForExtensionHostHelperProcess.handlePreloadedMessagePortForExtensionHostHelperProcess',
    port,
    path,
  )
}

const createLegacyRemote = async (path) => {
  const getConnectionInfo = async () => {
    const connectionInfo = await SharedProcess.invoke('WebSocketCapability.createLegacyExtensionNodeRpc', path)
    return WebSocketCapability.resolveConnectionInfo(connectionInfo)
  }
  const { protocols, url } = await getConnectionInfo()
  const webSocket = ReconnectingWebSocket.create(url, protocols, getConnectionInfo)
  const firstEvent = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  if (firstEvent.type === FirstWebSocketEventType.Close) {
    webSocket.close()
    throw new IpcError('Websocket connection was immediately closed')
  }
  const ipc = IpcParentWithWebSocket.wrap(webSocket)
  return createRpc(ipc, () => webSocket.close())
}

const createLegacyElectron = async (path) => {
  const { port1, port2 } = new MessageChannel()
  const ipc = IpcParentWithNodeAlternate.wrap(port2)
  const rpc = createRpc(ipc, () => port2.close())
  port2.start()
  try {
    await createMessagePort(port1, path)
    return rpc
  } catch (error) {
    port1.close()
    port2.close()
    throw error
  }
}

const getRpc = (id) => {
  const rpc = rpcs[id]
  if (!rpc) {
    throw new Error(`node rpc ${id} not found`)
  }
  return rpc
}

export const create = async (_name, path) => {
  const id = Id.create()
  const platform = Platform.getPlatform()
  const rpc =
    platform === PlatformType.Remote
      ? await createLegacyRemote(path)
      : platform === PlatformType.Electron
        ? await createLegacyElectron(path)
        : undefined
  if (!rpc) {
    throw new Error('Node rpc is not available on this platform')
  }
  rpcs[id] = rpc
  return id
}

export const invoke = async (id, method, ...params) => {
  return getRpc(id).invoke(method, ...params)
}

export const dispose = (id) => {
  const rpc = getRpc(id)
  delete rpcs[id]
  rpc.dispose()
}
