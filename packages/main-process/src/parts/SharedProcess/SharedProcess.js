import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as Process from '../Process/Process.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

export const state = {
  /**
   * @type{any|undefined}
   */
  sharedProcess: undefined,
  onMessage(message) {},
}

const handleChildError = (error) => {
  Process.exit(ExitCode.Error)
}

const logError = (error, prettyError) => {
  PrintPrettyError.printPrettyError(prettyError, '[main-process] ')
}

const handleChildMessage = async (message) => {
  if (message === 'ready') {
    return
  }
  if (Array.isArray(message)) {
    Logger.warn('invalid message', message)
    return
  }
  await JsonRpc.handleJsonRpcMessage(
    state.sharedProcess,
    message,
    Command.execute,
    Callback.resolve,
    PrettyError.prepare,
    logError,
    RequiresSocket.requiresSocket,
  )
}

const handleProcessExit = async () => {
  if (state.sharedProcess) {
    // await state.sharedProcess.terminate()
    // state.sharedProcess.postMessage('terminate')
    Logger.info('[main process] terminating shared process')
    state.sharedProcess.dispose()
    state.sharedProcess = undefined

    // state.sharedProcess.
  }
}

const handleChildExit = (code) => {
  Logger.info(`[main process] shared process exited with code ${code}`)
  Process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main process] shared process disconnected')
}

// TODO not possible because  TypeError [ERR_INVALID_HANDLE_TYPE]: This handle type cannot be sent
// export const sendPort = (port) => {
//   state.sharedProcess.send('here-is-the-port', port)
// }

export const hydrate = async ({ method, env = {} }) => {
  if (state.sharedProcess) {
    return state.sharedProcess
  }
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)

  // console.log('hydrate server')
  // TODO spawn seems to be a lot faster than fork for unknown reasons
  // const child = fork('../../packages/web/bin/web.js', {
  //   // stdio: 'pipe',
  //   // stdio: 'inherit',
  //   stdio: 'overlapped',
  // })

  if (state.sharedProcess) {
    // @ts-ignore
    state.sharedProcess.off('disconnect', handleChildDisconnect)
    // @ts-ignore
    state.sharedProcess.off('exit', handleChildExit)
    // @ts-ignore
    state.sharedProcess.dispose()
    state.sharedProcess = undefined
  }
  // TODO inherit stdout but listen to ready event
  const sharedProcessPath = Platform.getSharedProcessPath()
  const sharedProcess = await IpcParent.create({
    method,
    env: {
      ...process.env,
      ...env,
    },
    argv: [],
    execArgv: ['--enable-source-maps'],
    path: sharedProcessPath,
    name: 'shared-process',
  })
  // TODO handle all possible errors from web server process
  sharedProcess.on('error', handleChildError)
  sharedProcess.on('message', handleChildMessage)
  sharedProcess.on('exit', handleChildExit)
  sharedProcess.on('disconnect', handleChildDisconnect)
  process.on('exit', handleProcessExit) // TODO
  state.sharedProcess = sharedProcess
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
  return sharedProcess
}
