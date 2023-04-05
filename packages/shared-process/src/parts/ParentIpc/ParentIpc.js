import { MessagePort, parentPort } from 'node:worker_threads'
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as Debug from '../Debug/Debug.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as Logger from '../Logger/Logger.js'
import * as ProtocolType from '../ProtocolType/ProtocolType.js'
import { VError } from '../VError/VError.js'
// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
}

// TODO apparent there are multiple ways for listening to ipc
// 1. parentPort
// 2. process.send
// instead of if/else use interface and abstraction: ParentPortIpc.listen(), ProcessIpc.listen(), ParentPortIpc.send(message), ProcessIpc.send(message)

export const electronSend = (message) => {
  if (parentPort) {
    // @ts-ignore
    // process.send(message)
    parentPort.postMessage(message)
  } else if (process.send) {
    process.send(message)
  }
}

const handleWebSocketSharedProcess = (message, handle) => {
  // TODO when it is an extension host websocket, spawn extension host
  handle.on('error', (error) => {
    if (error && error.code === ErrorCodes.ECONNRESET) {
      return
    }
    console.info('[info shared process: handle error]', error)
  })
  Command.execute(/* WebSocketServer.handleUpgrade */ 'WebSocketServer.handleUpgrade', /* message */ message, /* handle */ handle)
}

// TODO lazyload modules for spawning extension host, they are only needed later
const handleWebSocketExtensionHost = async (message, handle) => {
  // console.log('[shared-process] received extension host websocket', message)
  const ipc = await ExtensionHostIpc.create()
  console.info('[sharedprocess] creating extension ipc')
  const rpc = await ExtensionHostRpc.create(ipc, handle)
  console.info('[sharedprocess] created extension host rpc')
  ipc._process.send(message, handle)
  // rpc.send(message)
  // console.log('spawned extension host')
  // console.log(rpc)
}

const handleWebSocketExtensionHostHelperProcess = async (message, handle) => {
  const ipc = await ExtensionHostHelperProcessIpc.create()
  ipc._process.send(message, handle)
}

const handleWebSocket = (message, handle) => {
  const headers = message.headers
  if (!headers) {
    throw new VError('missing websocket headers')
  }
  const protocol = headers['sec-websocket-protocol']
  if (!protocol) {
    throw new VError('missing sec websocket protocol header')
  }
  switch (protocol) {
    case ProtocolType.SharedProcess:
      return handleWebSocketSharedProcess(message, handle)
    case ProtocolType.ExtensionHost:
      return handleWebSocketExtensionHost(message, handle)
    case ProtocolType.ExtensionHostHelperProcess:
      return handleWebSocketExtensionHostHelperProcess(message, handle)
    default:
      Logger.warn(`[shared-process] unsupported sec-websocket-procotol ${protocol}`)
      handle.destroy()
  }
}

const handleJsonRpcResult = (message) => {
  Callback.resolve(message.id, message.result)
}

const handleJsonRpcMessage = async (message, handle) => {
  if (message.id) {
    const response = await GetResponse.getResponse(message, handle)
    electronSend(response)
  } else {
    // TODO handle error
    Command.execute(message.method, null, ...message.params)
  }
}

const handleMessageFromParentProcess = async (message, handle) => {
  if (handle) {
    return handleWebSocket(message, handle)
  }
  if (message.result) {
    return handleJsonRpcResult(message)
  }
  if (message.method) {
    return handleJsonRpcMessage(message, handle)
  }
  console.warn('unknown message', message)
}

/**
 *
 * @param {{initialize:{port: MessagePort, folder:string}}} initializeMessage
 */
const electronInitialize = (initializeMessage) => {
  const port = initializeMessage.initialize.port
  // TODO handle error
  const fakeSocket = {
    send: port.postMessage.bind(port),
    on(event, listener) {
      switch (event) {
        case 'close':
          port.on('close', listener)
          break
        case 'message':
          port.on('message', listener)
          break
        default:
          console.warn('socket event not implemented', event, listener)
          break
      }
    },
  }
  const handleOtherMessagesFromMessagePort = async (message) => {
    // console.log('got port message', message)
    if (message.result) {
      Callback.resolve(message.id, message.result)
    } else if (message.method) {
      if (message.id) {
        const response = await GetResponse.getResponse(message, fakeSocket)
        port.postMessage(response)
      } else {
        console.warn(`[shared process] sending messages without id is deprecated: ${message.method}`)
        Command.execute(message.method, fakeSocket, ...message.params)
      }
    } else {
      console.warn('unknown message', message)
    }
  }
  port.on('message', handleOtherMessagesFromMessagePort)
}

const handleMessageFromParentProcessElectron = async (message) => {
  if (message.initialize) {
    electronInitialize(message)
    return
  }
  if ('result' in message) {
    Callback.resolve(message.id, message.result)
    return
  }

  console.log('unknown message from electron', message)
  console.log({ message })
}

// TODO maybe rename to hydrate
export const listen = () => {
  // TODO tree-shake out if-else
  // console.log({ ...process.env })
  if (process.env.ELECTRON_RUN_AS_NODE && parentPort) {
    // electron process listens to main process ipc
    Debug.debug('is electron')
    // @ts-ignore
    parentPort.on('message', handleMessageFromParentProcessElectron)
    electronSend('ready')
  } else {
    Debug.debug('is not electron')
    // otherwise listen to web process ipc
    // and when a socket is transferred,
    // listen to socket messages also
    process.on('message', handleMessageFromParentProcess)
    if (process.send) {
      process.send('ready')
    }
  }
}
