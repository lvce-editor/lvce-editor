import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as Json from '../Json/Json.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

export const state = {
  authentication: 'query-token',
  token: '',
  url: '',
  workspaceUri: '',
}

const isLoopbackUrl = (value) => {
  const url = new URL(value)
  return url.protocol === 'ws:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]')
}

const isSecureRemoteUrl = (value) => {
  const url = new URL(value)
  return url.protocol === 'wss:'
}

export const set = (workspaceUri, url, token, authentication = 'query-token') => {
  if (
    typeof workspaceUri !== 'string' ||
    typeof url !== 'string' ||
    typeof token !== 'string' ||
    (authentication !== 'query-token' && authentication !== 'websocket-ticket')
  ) {
    throw new TypeError('Invalid workspace backend')
  }
  if (!isLoopbackUrl(url) && !(authentication === 'websocket-ticket' && isSecureRemoteUrl(url))) {
    throw new TypeError('Workspace backend must use loopback WebSocket or authenticated secure WebSocket')
  }
  state.workspaceUri = workspaceUri
  state.url = url
  state.token = token
  state.authentication = authentication
}

export const reset = () => {
  state.authentication = 'query-token'
  state.workspaceUri = ''
  state.url = ''
  state.token = ''
}

const getTicket = async () => {
  const endpoint = new URL('/auth/websocket-ticket', state.url)
  endpoint.protocol = endpoint.protocol === 'wss:' ? 'https:' : 'http:'
  const response = await fetch(endpoint, {
    headers: {
      authorization: `Bearer ${state.token}`,
    },
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`Failed to authorize remote WebSocket (${response.status})`)
  }
  const value = await response.json()
  if (!value || typeof value.ticket !== 'string') {
    throw new TypeError('Remote server returned an invalid WebSocket ticket')
  }
  return value.ticket
}

export const getWebSocketUrl = async (type) => {
  if (!state.url || WorkspaceState.state.workspaceUri !== state.workspaceUri) {
    return ''
  }
  const url = new URL(`/websocket/${encodeURIComponent(type)}`, state.url)
  if (state.authentication === 'websocket-ticket') {
    url.searchParams.set('ticket', await getTicket())
  } else {
    url.searchParams.set('token', state.token)
  }
  return url.toString()
}

export const isActive = () => Boolean(state.url && WorkspaceState.state.workspaceUri === state.workspaceUri)

export const connectMessagePort = async (type, port) => {
  if (!isActive()) {
    return false
  }
  const webSocket = await IpcParentWithWebSocket.create({
    getUrl: () => getWebSocketUrl(type),
    type,
  })
  webSocket.onmessage = (event) => {
    port.postMessage(Json.parse(event.data))
  }
  webSocket.onclose = () => port.close()
  port.onmessage = (event) => {
    webSocket.send(Json.stringifyCompact(event.data))
  }
  port.start?.()
  return true
}
