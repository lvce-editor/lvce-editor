import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const createConnection = async (extensionId, rpcId) => {
  const connection = await WebSocketCapability.create('extension-node-process')
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
  if (await WorkspaceConnection.connectMessagePort('extension-node-process', port, { extensionId, rpcId })) {
    return
  }
  await SharedProcess.invokeAndTransfer('HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess', port, extensionId, rpcId)
}
