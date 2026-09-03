import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as Json from '../Json/Json.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

const state = {
  command: '',
  remoteCliUrl: '',
  webSocketUrl: '',
  workspaceUri: '',
}

const validateWebSocketUrl = (value, name) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Invalid ${name}`)
  }
  if (value) {
    const url = new URL(value)
    if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
      throw new TypeError(`${name} must use WebSocket`)
    }
  }
}

export const set = (workspaceUri, command, remoteCliUrl = '', webSocketUrl = '') => {
  if (typeof workspaceUri !== 'string' || typeof command !== 'string' || !command) {
    throw new TypeError('Invalid workspace connection')
  }
  validateWebSocketUrl(remoteCliUrl, 'Remote CLI URL')
  validateWebSocketUrl(webSocketUrl, 'Workspace WebSocket URL')
  state.workspaceUri = workspaceUri
  state.command = command
  state.remoteCliUrl = remoteCliUrl
  state.webSocketUrl = webSocketUrl
}

export const reset = () => {
  state.workspaceUri = ''
  state.command = ''
  state.remoteCliUrl = ''
  state.webSocketUrl = ''
}

export const isActive = () => Boolean(state.command && WorkspaceState.state.workspaceUri === state.workspaceUri)

export const getCommand = () => {
  if (!isActive()) {
    return ''
  }
  return state.command
}

export const getRemoteCliUrl = () => {
  if (!isActive()) {
    return ''
  }
  return state.remoteCliUrl
}

export const getWebSocketUrlTemplate = () => {
  if (!isActive()) {
    return ''
  }
  return state.webSocketUrl
}

const addSearchParams = (value, searchParams) => {
  const url = new URL(value)
  for (const [key, parameterValue] of Object.entries(searchParams)) {
    url.searchParams.set(key, parameterValue)
  }
  return url.href
}

export const getWebSocketUrl = async (type, searchParams = {}) => {
  if (!isActive()) {
    return ''
  }
  const { command, webSocketUrl } = state
  if (webSocketUrl) {
    const url = new URL(webSocketUrl)
    url.pathname = `/websocket/${encodeURIComponent(type)}`
    return addSearchParams(url.href, searchParams)
  }
  const value = await ExtensionHostCommands.executeCommand(command, type)
  if (typeof value !== 'string') {
    throw new TypeError('Workspace connection command returned an invalid WebSocket URL')
  }
  const url = new URL(value)
  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new TypeError('Workspace connection command must return a WebSocket URL')
  }
  return addSearchParams(url.href, searchParams)
}

export const connectMessagePort = async (type, port, searchParams = {}) => {
  if (!isActive()) {
    return false
  }
  const webSocket = await IpcParentWithWebSocket.create({
    getUrl: () => getWebSocketUrl(type, searchParams),
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
