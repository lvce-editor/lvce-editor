import * as Location from '../Location/Location.js'
import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

let issuer = ''

export const initialize = (value) => {
  issuer = typeof value === 'string' ? value : ''
}

const resolveWebSocketUrl = (path) => {
  const protocol = WebSocketProtocol.getWebSocketProtocol()
  return `${protocol}//${Location.getHost()}${path}`
}

export const resolveConnectionInfo = (connectionInfo) => {
  return {
    ...connectionInfo,
    url: resolveWebSocketUrl(connectionInfo.url),
  }
}

export const create = async (target) => {
  if (!issuer) {
    throw new Error('websocket issuer is not initialized')
  }
  const response = await fetch(`/websocket-capabilities/${encodeURIComponent(target)}`, {
    headers: {
      Authorization: `Bearer ${issuer}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to create websocket capability: ${response.status}`)
  }
  const connectionInfo = await response.json()
  return resolveConnectionInfo(connectionInfo)
}
