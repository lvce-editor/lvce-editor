/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'

// TODO duplicate code with platform module
/**
 * @returns {'electron'|'remote'|'web'|'test'}
 */
const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'test'
  }
  if (typeof location !== 'undefined' && location.search === '?web') {
    return PlatformType.Web
  }
  if (
    typeof location !== 'undefined' &&
    location.search.includes('platform=electron')
  ) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

const platform = getPlatform() // TODO tree-shake this out in production

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const handleMessageFromSharedProcess = async (message) => {
  if (message.method) {
    const result = await Command.execute(message.method, ...message.params)
    if (message.id) {
      state.send({
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        result,
      })
    }
  } else {
    Callback.resolve(message.id, message)
  }
}

const getIpcMethod = () => {
  switch (platform) {
    case 'web':
    case 'remote':
      return IpcParentType.WebSocket
    case 'electron':
      return IpcParentType.ElectronMessagePort
    default:
      throw new Error('unsupported platform')
  }
}

export const listen = async () => {
  const ipcMethod = await getIpcMethod()
  const ipc = await SharedProcessIpc.listen(ipcMethod)
  ipc.onmessage = handleMessageFromSharedProcess
  state.ipc = ipc
}

export const send = (method, ...params) => {
  if (platform === 'web') {
    console.warn('SharedProcess is not available on web')
    return
  }
  JsonRpc.send(state.ipc, method, ...params)
}

export const invoke = async (method, ...params) => {
  if (platform === 'web') {
    console.warn('SharedProcess is not available on web')
    return
  }
  const result = await JsonRpc.invoke(state.ipc, method, ...params)
  return result
}

export const dispose = () => {
  state.dispose()
}

// TODO when shared process crashes / connection is lost: reconnect or show notification
