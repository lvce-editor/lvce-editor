import * as Assert from '../Assert/Assert.js'
import * as Timeout from '../Timeout/Timeout.js'
import { VError } from '../VError/VError.js'
import * as Logger from '../Logger/Logger.js'
// TODO maybe rename to extension host management for clarity

const CONNECTION_TIMEOUT = 3000

export const create = async (ipc, socket) => {
  Assert.object(socket)

  const handleChildProcessError = (error) => {
    Logger.error(`[Extension Host] ${error}`)
  }

  const handleChildProcessExit = (exitCode) => {
    Logger.info(`[SharedProcess] Extension Host exited with code ${exitCode}`)
  }

  const handleSocketClose = () => {
    Logger.info('[shared process] disposing extension host')
    ipc.dispose()
  }

  socket.on('close', handleSocketClose)

  ipc.on('error', handleChildProcessError)

  ipc.on('exit', handleChildProcessExit)

  await new Promise((resolve, reject) => {
    const handleFirstError = (error) => {
      cleanup()
      reject(error)
    }
    const handleFirstExit = (exitCode) => {
      cleanup()
      reject(new VError(`Extension Host exited with code ${exitCode}`))
    }
    const handleFirstMessage = (message) => {
      cleanup()
      if (message === 'ready') {
        resolve(undefined)
      } else {
        reject(new VError('Unexpected first message from extension host'))
      }
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
      clearTimeout(timeout)
    }
    const handleTimeout = () => {
      cleanup()
      reject(new VError('Extension host did not connect'))
    }
    const timeout = Timeout.setTimeout(handleTimeout, CONNECTION_TIMEOUT)
    ipc.on('error', handleFirstError)
    ipc.on('exit', handleFirstExit)
    ipc.on('message', handleFirstMessage)
    socket.on('close', handleSocketClose)
  })

  return {
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
}
