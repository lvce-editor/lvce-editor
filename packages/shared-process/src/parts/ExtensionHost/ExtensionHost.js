import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as Error from '../Error/Error.js'
import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Socket from '../Socket/Socket.js'
// TODO maybe rename to extension host management for clarity

/**
 * @type{any}
 */
export const state = {
  extensionHosts: Object.create(null),
}

const onMessage = (message) => {
  if (message.id) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(
        message.id,
        new Error.OperationalError({
          code: 'E_CALLBACK_REJECTED',
          message: message.error.message,
          stack: message.error.data.stack,
          codeFrame: message.error.data.codeFrame,
          // @ts-ignore
          stderr: message.error.data.stderr,
        })
      )
    } else {
      Socket.send(message)
    }
  } else {
    Socket.send(message)
  }
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
    send(message) {
      ipc.send(message)
    },
    invoke(...args) {
      return JsonRpc.invoke(ipc, ...args)
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
      ipc.on('message', onMessage)
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
    const extensionHost = await createExtensionHost(socket)
    state.extensionHosts[id] = extensionHost
    return id
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to start extension host')
  }
}

export const send = (id, message) => {
  console.log({ id, message })
  Assert.number(id)
  Assert.object(message)
  console.log(state.extensionHosts)
  const extensionHost = state.extensionsHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  console.log({ extensionHost })
  extensionHost.send(message)
}

export const dispose = (id) => {
  const extensionHost = state.extensionHosts[id]
  if (!extensionHost) {
    throw new VError(`no extension host with id ${id} found`)
  }
  extensionHost.dispose()
  delete state.extensionHosts[id]
}
