import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

/** @type {{ connectionKey: string, ipc: any, token: symbol | undefined }} */
const state = {
  connectionKey: '',
  ipc: undefined,
  token: undefined,
}

const parseOpenRequest = (value) => {
  if (
    !value ||
    (value.kind !== 'file' && value.kind !== 'folder') ||
    typeof value.path !== 'string' ||
    !value.path.startsWith('/') ||
    value.path.includes('\0')
  ) {
    throw new TypeError('Remote CLI returned an invalid open request')
  }
  return value
}

const createRpc = async (url) => {
  const webSocket = await IpcParentWithWebSocket.create({
    type: 'shared-process',
    url,
  })
  const ipc = IpcParentWithWebSocket.wrap(webSocket)
  HandleIpc.handleIpc(ipc)
  return ipc
}

const run = async (token, ipc, handleOpenRequest) => {
  while (state.token === token) {
    const value = await JsonRpc.invoke(ipc, 'RemoteCli.waitForOpenRequest')
    if (state.token !== token) {
      return
    }
    if (value) {
      await handleOpenRequest(parseOpenRequest(value))
    }
  }
}

export const stop = () => {
  state.connectionKey = ''
  state.token = undefined
  if (state.ipc) {
    HandleIpc.unhandleIpc(state.ipc)
    state.ipc.webSocket.close()
    state.ipc = undefined
  }
}

export const start = async (connectionKey, remoteCliUrl, handleOpenRequest, create = createRpc) => {
  if (state.connectionKey === connectionKey && state.ipc) {
    return
  }
  stop()
  const token = Symbol(connectionKey)
  state.connectionKey = connectionKey
  state.token = token
  const ipc = await create(remoteCliUrl)
  if (state.token !== token) {
    ipc.webSocket.close()
    return
  }
  state.ipc = ipc
  void run(token, ipc, handleOpenRequest).catch(() => {
    if (state.token === token) {
      stop()
    }
  })
}

const replacePath = (workspaceUri, path) => {
  const url = new URL(workspaceUri)
  url.pathname = path
  url.search = ''
  url.hash = ''
  return url.href
}

export const resolveOpenRequest = (workspaceUri, request) => {
  const parsed = parseOpenRequest(request)
  const workspacePath =
    parsed.kind === 'folder'
      ? parsed.path
      : parsed.path.slice(0, parsed.path.lastIndexOf('/')) || '/'
  return {
    fileUri:
      parsed.kind === 'file' ? replacePath(workspaceUri, parsed.path) : '',
    workspacePath,
    workspaceUri: replacePath(workspaceUri, workspacePath),
  }
}

export const _reset = stop
