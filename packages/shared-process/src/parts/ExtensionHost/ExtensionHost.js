import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as Error from '../Error/Error.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Socket from '../Socket/Socket.js'
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

  const handleChildProcessError = (error) => {
    console.error(`[Extension Host] ${error}`)
  }

  const handleChildProcessExit = (exitCode) => {
    console.info(`[SharedProcess] Extension Host exited with code ${exitCode}`)
  }

  const handleSocketClose = () => {
    console.info('[shared process] disposing extension host')
    ipc.dispose()
  }

  socket.on('close', handleSocketClose)

  ipc.on('error', handleChildProcessError)

  ipc.on('exit', handleChildProcessExit)

  const extensionHost = {
    on(event, listener) {
      ipc.on(event, listener)
    },
    send(message) {
      ipc.send(message)
    },
    dispose() {
      ipc.dispose()
    },
  }

  await new Promise((resolve, reject) => {
    const handleFirstError = (error) => {
      cleanup()
      reject(error)
    }
    const handleFirstExit = (exitCode) => {
      cleanup()
      reject(new VError(`Extension Host exited with code ${exitCode}`))
    }
    const handleFirstMessage = () => {
      cleanup()
      resolve(undefined)
    }
    const handleSocketClose = () => {
      cleanup()
      ipc.off('error', handleChildProcessError)
      ipc.off('exit', handleChildProcessExit)
      resolve(undefined)
    }
    const cleanup = () => {
      ipc.off('error', handleFirstError)
      ipc.off('exit', handleFirstExit)
      ipc.off('message', handleFirstMessage)
    }
    ipc.on('error', handleFirstError)
    ipc.on('exit', handleFirstExit)
    ipc.on('message', handleFirstMessage)
    socket.on('close', handleSocketClose)
  })
  return extensionHost
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

export const send = async (id, message) => {
  Assert.number(id)
  Assert.object(message)
  console.log(Object.keys(state))
  const extensionHost = state.extensionHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  const result = await JsonRpc.invoke(
    extensionHost,
    message.method,
    ...message.params
  )
  console.log({ result })
  return result
}

export const dispose = (id) => {
  const extensionHost = state.extensionHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  extensionHost.dispose()
  delete state.extensionHosts[id]
}
