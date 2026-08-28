import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as Json from '../Json/Json.js'
import * as WorkspaceState from '../WorkspaceState/WorkspaceState.js'

const state = {
  command: '',
  remoteCliUrl: '',
  workspaceUri: '',
}

export const set = (workspaceUri, command, remoteCliUrl = '') => {
  if (typeof workspaceUri !== 'string' || typeof command !== 'string' || !command) {
    throw new TypeError('Invalid workspace connection')
  }
  if (typeof remoteCliUrl !== 'string') {
    throw new TypeError('Invalid remote CLI URL')
  }
  if (remoteCliUrl) {
    const url = new URL(remoteCliUrl)
    if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
      throw new TypeError('Remote CLI URL must use WebSocket')
    }
  }
  state.workspaceUri = workspaceUri
  state.command = command
  state.remoteCliUrl = remoteCliUrl
}

export const reset = () => {
  state.workspaceUri = ''
  state.command = ''
  state.remoteCliUrl = ''
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

export const getWebSocketUrl = async (type) => {
  if (!isActive()) {
    return ''
  }
  const value = await ExtensionHostCommands.executeCommand(state.command, type)
  if (typeof value !== 'string') {
    throw new TypeError('Workspace connection command returned an invalid WebSocket URL')
  }
  const url = new URL(value)
  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new TypeError('Workspace connection command must return a WebSocket URL')
  }
  return url.href
}

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
