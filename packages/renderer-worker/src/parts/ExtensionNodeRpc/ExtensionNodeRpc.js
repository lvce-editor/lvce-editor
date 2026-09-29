import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.js'
import * as Location from '../Location/Location.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createConnection = async (extensionId, rpcId) => {
  const url = new URL(GetWebSocketUrl.getWebSocketUrl('extension-node-process', Location.getHost()))
  url.searchParams.set('extensionId', extensionId)
  url.searchParams.set('rpcId', rpcId)
  return { protocols: [], url: url.toString() }
}

export const supportsDirectConnection = () => true

export const createMessagePort = async (port, extensionId, rpcId) => {
  await SharedProcess.invokeAndTransfer('HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess', port, extensionId, rpcId)
}
