import { MessagePort, parentPort } from 'node:worker_threads'
import VError from 'verror'
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as Debug from '../Debug/Debug.js'
import * as Error from '../Error/Error.js'
import { requiresSocket } from '../RequiresSocket/RequiresSocket.js'
import * as Platform from '../Platform/Platform.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'
import * as TerminalProcessIpc from '../TerminalProcessIpc/TerminalProcessIpc.js'
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
    if (error && error.code === 'ECONNRESET') {
      return
    }
    console.info('[info shared process: handle error]', error)
  })
  Command.execute(
    /* WebSocketServer.handleUpgrade */ 5621,
    /* message */ message,
    /* handle */ handle
  )
}

// TODO lazyload modules for spawning extension host, they are only needed later
const handleWebSocketExtensionHost = async (message, handle) => {
  // console.log('[shared-process] received extension host websocket', message)
  const ipc = ExtensionHostIpc.create()
  console.info('[sharedprocess] creating extension ipc')
  const rpc = await ExtensionHostRpc.create(ipc, handle)
  console.info('[sharedprocess] created extension host rpc')
  ipc._process.send(message, handle)
  // rpc.send(message)
  // console.log('spawned extension host')
  // console.log(rpc)
}

const handleWebSocketTerminalProcess = async (message, handle) => {
  const ipc = await TerminalProcessIpc.create()
  ipc.send(message, handle)
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
    case 'lvce.shared-process':
      return handleWebSocketSharedProcess(message, handle)
    case 'lvce.extension-host':
      return handleWebSocketExtensionHost(message, handle)
    case 'lvce.terminal-process':
      return handleWebSocketTerminalProcess(message, handle)
    default:
      throw new VError(`unsupported sec-websocket-procotol ${protocol}`)
  }
}

const handleJsonRpcResult = (message) => {
  Callback.resolve(message.id, message.result)
}

const handleJsonRpcMessage = async (message, handle) => {
  if (message.id) {
    try {
      const result = requiresSocket(message.method)
        ? await Command.invoke(message.method, handle, ...message.params)
        : await Command.invoke(message.method, ...message.params)
      electronSend({
        jsonrpc: '2.0',
        id: message.id,
        result: result ?? null,
      })
    } catch (error) {
      console.error('[shared process] command failed to execute')
      console.error(error)
      electronSend({
        jsonrpc: '2.0',
        code: /* ExpectedError */ -32000,
        id: message.id,
        error: 'ExpectedError',
        // @ts-ignore
        data: error.toString(),
      })
    }
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
        try {
          const result = requiresSocket(message.method)
            ? await Command.invoke(
                message.method,
                fakeSocket,
                ...message.params
              )
            : await Command.invoke(message.method, ...message.params)

          port.postMessage({
            jsonrpc: '2.0',
            id: message.id,
            result: result ?? null,
          })
        } catch (error) {
          // TODO duplicate code with Socket.js, clean this up
          if (error instanceof Error.OperationalError) {
            // console.log({ error })
            const rawCause = error.cause()
            const errorCause = rawCause ? rawCause.message : ''
            const errorMessage = rawCause
              ? error.message.slice(0, error.message.indexOf(errorCause))
              : ''

            // console.info('expected error', error)
            port.postMessage({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: /* ExpectedError */ -32000,
                message: error.message,
                data: {
                  stack: error.originalStack,
                  codeFrame: error.originalCodeFrame,
                  category: error.category,
                  // @ts-ignore
                  stderr: error.stderr,
                },
              },
            })
          } else {
            console.error('[shared process] command failed to execute')
            console.error(error)
            // TODO check if socket is active
            port.postMessage({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: /* UnexpectedError */ -32001,
                // @ts-ignore
                message: error.toString(),
              },
            })
          }
        }
      } else {
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
