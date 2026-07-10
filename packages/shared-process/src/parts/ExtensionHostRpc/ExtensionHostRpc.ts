import * as Assert from '../Assert/Assert.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import { VError } from '../VError/VError.ts'
// TODO maybe rename to extension host management for clarity

const CONNECTION_TIMEOUT = 3000

export const create = async (ipc: any, socket: any): Promise<any> => {
  Assert.object(socket)

  const handleChildProcessError = (error: any): any => {
    Logger.error(`[Extension Host] ${error}`)
  }

  const handleChildProcessExit = (exitCode: any): any => {
    Logger.info(`[SharedProcess] Extension Host exited with code ${exitCode}`)
  }

  const handleSocketClose = (): any => {
    Logger.info('[shared process] disposing extension host')
    ipc.dispose()
  }

  socket.on('close', handleSocketClose)

  ipc.on('error', handleChildProcessError)

  ipc.on('exit', handleChildProcessExit)

  await new Promise((resolve: any, reject: any) => {
    const handleFirstError = (error: any): any => {
      cleanup()
      reject(error)
    }
    const handleFirstExit = (exitCode: any): any => {
      cleanup()
      reject(new VError(`Extension Host exited with code ${exitCode}`))
    }
    const handleFirstMessage = (message: any): any => {
      cleanup()
      if (message === 'ready') {
        resolve(undefined)
      } else {
        reject(new VError('Unexpected first message from extension host'))
      }
    }
    const handleSocketClose = (): any => {
      cleanup()
      ipc.off('error', handleChildProcessError)
      ipc.off('exit', handleChildProcessExit)
      resolve(undefined)
    }
    const cleanup = (): any => {
      ipc.off('error', handleFirstError)
      ipc.off('exit', handleFirstExit)
      ipc.off('message', handleFirstMessage)
      clearTimeout(timeout)
    }
    const handleTimeout = (): any => {
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
    dispose(): any {
      ipc.dispose()
    },
    on(event: any, listener: any): any {
      ipc.on(event, listener)
    },
    send(message: any): any {
      ipc.send(message)
    },
  }
}
