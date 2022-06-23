import VError from 'verror'
import * as Callback from '../Callback/Callback.js'
import * as ChildProcess from '../ChildProcess/ChildProcess.js'
import * as Error from '../Error/Error.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as Socket from '../Socket/Socket.js'
import * as Assert from '../Assert/Assert.js'
// TODO maybe rename to extension host management for clarity

// TODO needed? probably not
const NULL_EXTENSION_HOST = {
  dispose() {
    throw new VError('not implemented')
  },
  send(message) {
    throw new VError(
      'extension host must be started before commands can be invoked'
    )
  },
  async invoke(commandId, ...args) {
    throw new VError(
      'extension host must be started before commands can be invoked'
    )
  },
}

/**
 * @type{{
 *   extensionHost: {dispose:()=>void, invoke:(commandId, ...args)=>Promise<any>},
 * }}
 */
export const state = {
  extensionHost: NULL_EXTENSION_HOST,
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
export const start = async (socket) => {
  try {
    Assert.object(socket)
    const extensionHostPath = Platform.getExtensionHostPath()
    const childProcess = ChildProcess.fork(extensionHostPath, {
      execArgv: [
        '--experimental-json-modules',
        '--max-old-space-size=60',
        '--enable-source-maps',
      ],
      env: {
        ...process.env,
        LOGS_DIR: Platform.getLogsDir(),
        CONFIG_DIR: Platform.getConfigDir(),
      },
    })

    const handleChildProcessError = (error) => {
      console.error(`[Extension Host] ${error}`)
    }

    const handleChildProcessExit = (exitCode) => {
      console.info(
        `[SharedProcess] Extension Host exited with code ${exitCode}`
      )
      state.extensionHost = NULL_EXTENSION_HOST
    }

    const handleSocketClose = () => {
      console.info('[shared process] disposing extension host')
      childProcess.kill()
    }

    socket.on('close', handleSocketClose)

    childProcess.on('error', handleChildProcessError)

    childProcess.on('exit', handleChildProcessExit)

    state.extensionHost = {
      invoke(...args) {
        return JsonRpc.invoke(childProcess, ...args)
      },
      dispose() {
        childProcess.kill()
      },
    }

    await new Promise((resolve, reject) => {
      const handleFirstError = (error) => {
        cleanup()
        reject(error)
      }
      const handleFirstExit = (exitCode) => {
        cleanup()
        reject(
          new globalThis.Error(`Extension Host exited with code ${exitCode}`)
        )
      }
      const handleFirstMessage = () => {
        cleanup()
        childProcess.on('message', onMessage)
        resolve(undefined)
      }
      const handleSocketClose = () => {
        cleanup()
        childProcess.off('error', handleChildProcessError)
        childProcess.off('exit', handleChildProcessExit)
        resolve(undefined)
      }
      const cleanup = () => {
        childProcess.off('error', handleFirstError)
        childProcess.off('exit', handleFirstExit)
        childProcess.off('message', handleFirstMessage)
      }
      childProcess.on('error', handleFirstError)
      childProcess.on('exit', handleFirstExit)
      childProcess.on('message', handleFirstMessage)
      socket.on('close', handleSocketClose)
    })
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to start extension host')
  }
}

export const stop = () => {
  state.extensionHost.dispose()
  state.extensionHost = NULL_EXTENSION_HOST
}

export const restart = () => {
  stop()
  start()
}

export const wrapExtensionHostCommand = (fn) => {
  const wrappedExtensionHostCommand = (...args) => {
    return fn(state.extensionHost, ...args)
  }
  return wrappedExtensionHostCommand
}
