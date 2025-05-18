import * as Command from '../Command/Command.js'
import * as HandleDisconnect from '../HandleDisconnect/HandleDisconnect.js'
import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.js'
import * as Module from '../Module/Module.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as ProcessListeners from '../ProcessListeners/ProcessListeners.js'
import * as Signal from '../Signal/Signal.js'

export const main = async () => {
  Error.stackTraceLimit = 999
  Command.setLoad(Module.load)
  process.on('disconnect', HandleDisconnect.handleDisconnect)
  process.on(Signal.SIGTERM, ProcessListeners.handleSigTerm)
  process.on('uncaughtException', HandleUncaughtExceptionMonitor.handleUncaughtException)
  process.on('unhandledRejection', HandleUncaughtExceptionMonitor.handleUnhandledRejection)
  await ParentIpc.listen()
}
