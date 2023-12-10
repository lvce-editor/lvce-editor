// @ts-ignore
performance.mark('code/start')
import * as Command from '../Command/Command.js'
import * as Module from '../Module/Module.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as App from '../App/App.js'
import * as SetStackTraceLimit from '../SetStackTraceLimit/SetStackTraceLimit.js'
import * as Process from '../Process/Process.js'

export const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  Process.on('uncaughtExceptionMonitor', ErrorHandling.handleUncaughtExceptionMonitor)
  // workaround for https://github.com/electron/electron/issues/36526
  Process.on('unhandledRejection', ErrorHandling.handleUnhandledRejection)
  Command.setLoad(Module.load)
  await App.hydrate()
}
