import * as Assert from '../Assert/Assert.ts'
import * as DestroyWebSocket from '../DestroySocket/DestroySocket.ts'
import * as GetTypeFromUrl from '../GetTypeFromUrl/GetTypeFromUrl.ts'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.ts'
import * as IsAllowedWebSocketOrigin from '../IsAllowedWebSocketOrigin/IsAllowedWebSocketOrigin.ts'
import * as RejectWebSocket from '../RejectWebSocket/RejectWebSocket.ts'
import { VError } from '../VError/VError.ts'
import * as WebSocketCapabilityRegistry from '../WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'

const capabilityPath = '/websocket/capability'

const getCapabilityToken = (message: any): string => {
  const header = message.headers?.['sec-websocket-protocol']
  if (typeof header !== 'string') {
    return ''
  }
  const protocols = header.split(',').map((protocol) => protocol.trim())
  if (!protocols.includes(WebSocketCapabilityRegistry.capabilityProtocol)) {
    return ''
  }
  const capabilityProtocol = protocols.find((protocol) => protocol.startsWith(WebSocketCapabilityRegistry.capabilityProtocolPrefix))
  return capabilityProtocol?.slice(WebSocketCapabilityRegistry.capabilityProtocolPrefix.length) || ''
}

const sanitizeProtocols = (message: any): void => {
  message.headers = {
    ...message.headers,
    'sec-websocket-protocol': WebSocketCapabilityRegistry.capabilityProtocol,
  }
}

export const handleWebSocket = async (handle: any, message: any): Promise<any> => {
  try {
    Assert.object(handle)
    Assert.object(message)
    if (!IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin(message)) {
      RejectWebSocket.rejectWebSocket(handle)
      return
    }
    const { url } = message
    if (url.split('?')[0] !== capabilityPath) {
      RejectWebSocket.rejectWebSocket(handle)
      return
    }
    const token = getCapabilityToken(message)
    const capability = WebSocketCapabilityRegistry.consume(token)
    if (!capability) {
      RejectWebSocket.rejectWebSocket(handle)
      return
    }
    sanitizeProtocols(message)
    const type = capability.target
    handle.pause()
    const module = HandleWebSocketModule.load(type)
    await module.handleWebSocket(message, handle, type, capability)
  } catch (error) {
    DestroyWebSocket.destroySocket(handle)
    throw new VError(error, `Failed to connect to websocket`)
  }
}
