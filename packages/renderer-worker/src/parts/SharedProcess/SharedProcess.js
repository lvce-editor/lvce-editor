/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessWithElectron from './SharedProcessWithElectron.js'
import * as SharedProcessWithWebSocket from './SharedProcessWithWebSocket.js'

// TODO duplicate code with platform module
/**
 * @returns {'electron'|'remote'|'web'|'test'}
 */
const getPlatform = () => {
  // TODO maybe use import.meta.env.PLATFORM
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'test'
  }

  // TODO don't use window here -> want to run renderer-worker as webworker
  if (
    // @ts-ignore
    typeof window !== 'undefined' &&
    // @ts-ignore
    window.myApi &&
    // @ts-ignore
    window.myApi.ipcConnect &&
    // @ts-ignore
    typeof window.myApi.ipcConnect === 'function'
  ) {
    return 'electron'
  }
  return 'remote'
}

export const platform = getPlatform() // TODO tree-shake this out in production

const constructError = (message) => {
  if (message.startsWith('Error: ')) {
    return new Error(message.slice('Error: '.length))
  }
  if (message.startsWith('TypeError: ')) {
    return new TypeError(message.slice('TypeError: '.length))
  }
  if (message.startsWith('SyntaxError: ')) {
    return new SyntaxError(message.slice('SyntaxError: '.length))
  }
  return new Error(message)
}

const preparePrettyError = (rawError) => {
  const error = constructError(rawError.message)
  if (rawError.data && rawError.data.stack) {
    // @ts-ignore
    error.originalStack = rawError.data.stack
  }
  if (rawError.data && rawError.data.codeFrame) {
    // @ts-ignore
    error.originalCodeFrame = rawError.data.codeFrame
  }
  if (rawError.data && rawError.data.category) {
    // @ts-ignore
    error.category = rawError.data.category
  }
  if (rawError.data && rawError.data.stderr) {
    // @ts-ignore
    error.stderr = rawError.data.stderr
  }
  return error
}

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
        jsonrpc: '2.0',
        id: message.id,
        result,
      })
    }
  } else {
    Callback.resolve(message.id, message)
  }
}

const getIpc = () => {
  if (platform === 'web' || platform === 'remote') {
    return SharedProcessWithWebSocket.listen()
  }
  if (platform === 'electron') {
    return SharedProcessWithElectron.listen()
  } else {
    throw new Error('unsupported platform')
  }
}

export const listen = () => {
  const ipc = getIpc()
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
  const responseMessage = await JsonRpc.invoke(state.ipc, method, ...params)
  if (responseMessage.error) {
    const prettyError = preparePrettyError(responseMessage.error)
    throw prettyError
  }
  return responseMessage.result
}

export const dispose = () => {
  state.dispose()
}

// TODO when shared process crashes / connection is lost: reconnect or show notification
