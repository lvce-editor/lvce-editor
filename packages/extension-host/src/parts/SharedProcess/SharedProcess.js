import * as Ipc from '../Ipc/Ipc.js'

// import * as PrettyError from '../PrettyError/PrettyError.js'

export const state = {
  ipc: undefined,
  pendingRequests: Object.create(null),
}

// TODO sometimes error occurs here when parent process dies
// Error [ERR_IPC_CHANNEL_CLOSED]: Channel closed
//     at new NodeError (node:internal/errors:371:5)
//     at process.target.send (node:internal/child_process:721:16)
//     at Object.state16.send (file:///usr/lib/lvce-oss/resources/app/packages/extension-host/dist/extensionHostMain.js:7546:13)
// maybe need to manually exit in this case https://stackoverflow.com/questions/5541288/detect-when-parent-process-exits
export const send = (message) => {
  if (!message) {
    console.trace(message)
  }
  if (!state.ipc) {
    throw new Error('ipc not initialized')
  }
  // @ts-ignore
  state.ipc.send(message)
}

// const handleProcessSendError = (error) => {
//   if (error && error.code === 'EPIPE') {
//     // parent process is disposed, ignore
//     return
//   }
//   throw error
// }

const shouldPrintError = (error) => {
  if (!error || !error.message) {
    return true
  }
  if (
    error.message.startsWith(
      'Failed to execute semantic token provider: VError: no semantic token provider found for'
    ) ||
    error.message.startsWith(
      'Failed to execute definition provider: No definition provider found for'
    )
  ) {
    return false
  }
  if (error && error.stderr) {
    return false
  }
  return true
}

const getIpcType = (argv) => {
  if (argv.includes('--ipc-type=websocket')) {
    return Ipc.Methods.WebSocket
  }
  if (argv.includes('--ipc-type=parent')) {
    return Ipc.Methods.ChildProcess
  }
  if (argv.includes('--ipc-type=worker')) {
    return Ipc.Methods.Worker
  }

  throw new Error('[extension-host] unknown ipc type')
}

export const listen = async (InternalCommand) => {
  const argv = process.argv.slice(2)
  console.log({ argv })
  const ipcType = getIpcType(argv)
  const ipc = await Ipc.listen(ipcType)
  const handleMessage = async (message) => {
    if (Array.isArray(message)) {
      for (const subMessage of message) {
        handleMessage(subMessage)
      }
    } else {
      const method = message.command || message.method
      if (method !== 'enableExtension') {
      }
      if (message.command) {
        console.trace('command is deprecated, use method instead', message)
      }
      if (message.args) {
        console.trace('args is deprecated, use params instead', message)
        message.params = message.args
      }
      if (message.id) {
        if (message.method) {
          let result
          try {
            result = await InternalCommand.invoke(method, ...message.params)
          } catch (error) {
            const PrettyError = await import('../PrettyError/PrettyError.js')
            const prettyError = PrettyError.prepare(error)
            if (shouldPrintError(error)) {
              PrettyError.print(prettyError)
            }
            send({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: -32001,
                message: prettyError.message,
                // @ts-ignore
                data: {
                  stack: prettyError.stack,
                  codeFrame: prettyError.codeFrame,
                  stderr: prettyError.stderr,
                },
              },
            })
            return
          }
          ipc.send({
            jsonrpc: '2.0',
            id: message.id,
            result: result ?? null,
          })
        } else {
          if (message.result) {
            state.pendingRequests[message.id].resolve(message.result)
          } else {
            state.pendingRequests[message.id].reject(message.error)
          }
          delete state.pendingRequests[message.id]
        }
      } else {
        // TODO should always have id to reject promise if error happens
        InternalCommand.invoke(method, ...message.params)
      }
    }
  }
  // @ts-ignore
  state.ipc = ipc
  ipc.on('message', handleMessage)
  console.log('[extension host] finished ipc setup')
  console.log({ ipc })
}

export const invoke = (method, ...parameters) => {
  const callbackId = 78
  return new Promise((resolve, reject) => {
    state.pendingRequests[callbackId] = {
      resolve,
      reject,
    }
    send({
      jsonrpc: '2.0',
      method,
      params: parameters,
      id: callbackId,
    })
  })
}
