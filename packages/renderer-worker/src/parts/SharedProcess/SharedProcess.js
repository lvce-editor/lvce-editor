/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as WebSocket from '../WebSocket/WebSocket.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SessionReplay from '../SessionReplay/SessionReplay.js'

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

// TODO state is actually not needed here, only for testing because jest doesn't support mocking esm
export const state = {
  pendingMessages: [],
  send(message) {
    state.pendingMessages.push(message)
  },
  async receive(message) {
    if (message.method) {
      await SessionReplay.handleMessage('from-shared-process', message)
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
  },
  dispose() {},
  totalSent: 0,
  totalReceived: 0,
  retryCount: 0,
}

export const listen = () => {
  console.assert(state.pendingMessages.length === 0)
  if (platform === 'web' || platform === 'remote') {
    // TODO replace this during build
    const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${wsProtocol}//${location.host}`
    const webSocket = WebSocket.create(wsUrl, state)
  } else if (platform === 'electron') {
    const handleMessage = (event) => {
      const port = event.ports[0]
      state.send = (message) => {
        port.postMessage(message)
      }
      port.onmessage = (event) => {
        const message = event.data
        state.receive(message)
      }
      for (const pendingMessage of state.pendingMessages) {
        state.send(pendingMessage)
      }
      // port.start()
    }
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
      // @ts-ignore
      window.addEventListener('message', handleMessage, { once: true })
      // @ts-ignore
      window.myApi.ipcConnect()
    } else {
      console.warn('api is not available')
    }
  }
}

export const send = (method, ...params) => {
  if (platform === 'web') {
    console.warn('SharedProcess is not available on web')
    return
  }
  JsonRpc.send(state, method, ...params)
}

export const invoke = async (method, ...params) => {
  if (platform === 'web') {
    console.warn('SharedProcess is not available on web')
    return
  }
  const responseMessage = await JsonRpc.invoke(state, method, ...params)
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
