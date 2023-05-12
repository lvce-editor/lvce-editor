import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'
import * as Logger from '../Logger/Logger.js'
import * as ProtocolType from '../ProtocolType/ProtocolType.js'
import { VError } from '../VError/VError.js'

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

const handleWebSocketUnknown = (message, handle, protocol) => {
  Logger.warn(`[shared-process] unsupported sec-websocket-procotol ${protocol}`)
  try {
    handle.destroy()
  } catch {
    // ignore
  }
}

export const handleWebSocket = (handle, message) => {
  Assert.object(message)
  Assert.object(handle)
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
      return handleWebSocketUnknown(message, handle, protocol)
  }
}
