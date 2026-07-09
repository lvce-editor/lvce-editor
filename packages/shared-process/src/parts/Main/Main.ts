import * as Command from '../Command/Command.ts'
import * as HandleDisconnect from '../HandleDisconnect/HandleDisconnect.ts'
import * as HandleUncaughtExceptionMonitor from '../HandleUncaughtExceptionMonitor/HandleUncaughtExceptionMonitor.ts'
import * as Module from '../Module/Module.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as ProcessListeners from '../ProcessListeners/ProcessListeners.ts'
import * as Signal from '../Signal/Signal.ts'

export const main = async (): Promise<any> => {
  Error.stackTraceLimit = 999
  Command.setLoad(Module.load)
  process.on('disconnect', HandleDisconnect.handleDisconnect)
  process.on(Signal.SIGTERM, ProcessListeners.handleSigTerm)
  process.on('uncaughtException', HandleUncaughtExceptionMonitor.handleUncaughtException)
  process.on('unhandledRejection', HandleUncaughtExceptionMonitor.handleUnhandledRejection)
  await ParentIpc.listen()
}
