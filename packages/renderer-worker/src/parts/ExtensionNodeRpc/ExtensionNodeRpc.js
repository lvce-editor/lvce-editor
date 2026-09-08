import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.js'
import * as Location from '../Location/Location.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const createConnection = async (extensionId, rpcId) => {
  // The SSH transport owns the local tunnel and must remain on the client.
  const connection =
    extensionId === 'builtin.remote-ssh'
      ? { protocols: [], url: GetWebSocketUrl.getWebSocketUrl('extension-node-process', Location.getHost()) }
      : await WebSocketCapability.create('extension-node-process')
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
  if (
    extensionId !== 'builtin.remote-ssh' &&
    (await WorkspaceConnection.connectMessagePort('extension-node-process', port, { extensionId, rpcId }))
  ) {
    return
  }
  await SharedProcess.invokeAndTransfer('HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess', port, extensionId, rpcId)
}
