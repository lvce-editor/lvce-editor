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
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

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
    SharedProcessState.state.sharedProcess,
    message,
    Command.execute,
    Callback.resolve,
    PrettyError.prepare,
    logError,
    RequiresSocket.requiresSocket,
  )
}

const handleChildExit = (code) => {
  Logger.info(`[main process] shared process exited with code ${code}`)
  Process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main process] shared process disconnected')
}

export const launchSharedProcess = async ({ method, env = {} }) => {
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)
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
  sharedProcess.on('error', handleChildError)
  sharedProcess.on('message', handleChildMessage)
  sharedProcess.on('exit', handleChildExit)
  sharedProcess.on('disconnect', handleChildDisconnect)
  SharedProcessState.state.sharedProcess = sharedProcess
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
  return sharedProcess
}
