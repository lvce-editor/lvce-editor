import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

// TODO maybe rename to extension host management for clarity

/**
 * @type{{extensionHosts:any }}
 */
export const state = {
  extensionHosts: Object.create(null),
}

// TODO this function is very ugly and has probably memory leaks
const createExtensionHost = async (socket) => {
  Assert.object(socket)
  const ipc = ExtensionHostIpc.create()
  const rpc = ExtensionHostRpc.create(ipc, socket)
  return rpc
}

export const start = async (socket) => {
  try {
    const id = 1
    console.log('start extension host', id)
    const handleMessage = (message) => {
      if ('result' in message) {
        Callback.resolve(message.id, message.result)
      } else if ('error' in message) {
        Callback.reject(message.id, message.error)
      } else {
        console.error('unsupported message type')
      }
    }
    const extensionHost = await createExtensionHost(socket)
    extensionHost.on('message', handleMessage)
    state.extensionHosts[id] = extensionHost
    return id
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to start extension host')
  }
}

export const send = async (socket, id, message) => {
  Assert.number(id)
  Assert.object(message)
  console.log(Object.keys(state))
  const extensionHost = state.extensionHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  try {
    const result = await JsonRpc.invoke(
      extensionHost,
      message.method,
      ...message.params
    )
    socket.send({
      jsonrpc: '2.0',
      id: message.id,
      result,
    })
  } catch (error) {
    // console.log({ error })
    socket.send({
      jsonrpc: '2.0',
      id: message.id,
      error,
    })
  }
}

export const dispose = (id) => {
  const extensionHost = state.extensionHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  extensionHost.dispose()
  delete state.extensionHosts[id]
}
