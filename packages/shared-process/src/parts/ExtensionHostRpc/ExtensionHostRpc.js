import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import * as Timeout from '../Timeout/Timeout.js'

// TODO maybe rename to extension host management for clarity

const CONNECTION_TIMEOUT = 1000

export const create = async (ipc, socket) => {
  Assert.object(socket)

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
