import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as Json from '../Json/Json.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

export const state = {
  token: '',
  url: '',
  workspaceUri: '',
}

const isLoopbackUrl = (value) => {
  const url = new URL(value)
  return url.protocol === 'ws:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]')
}

export const set = (workspaceUri, url, token) => {
  if (typeof workspaceUri !== 'string' || typeof url !== 'string' || typeof token !== 'string') {
    throw new TypeError('Invalid workspace backend')
  }
  if (!isLoopbackUrl(url)) {
    throw new TypeError('Workspace backend must use a loopback WebSocket URL')
  }
  state.workspaceUri = workspaceUri
  state.url = url
  state.token = token
}

export const reset = () => {
  state.workspaceUri = ''
  state.url = ''
  state.token = ''
}

export const getWebSocketUrl = (type) => {
  if (!state.url || WorkspaceState.state.workspaceUri !== state.workspaceUri) {
    return ''
  }
  const url = new URL(`/websocket/${encodeURIComponent(type)}`, state.url)
  url.searchParams.set('token', state.token)
  return url.toString()
}

export const connectMessagePort = async (type, port) => {
  const url = getWebSocketUrl(type)
  if (!url) {
    return false
  }
  const webSocket = await IpcParentWithWebSocket.create({ type, url })
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
