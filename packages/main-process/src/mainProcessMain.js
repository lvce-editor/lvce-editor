// @ts-ignore
performance.mark('code/start')
import * as Command from './parts/Command/Command.js'
import * as Module from './parts/Module/Module.js'
import * as ErrorHandling from './parts/ErrorHandling/ErrorHandling.js'
import * as App from './parts/App/App.js'
import * as SetStackTraceLimit from './parts/SetStackTraceLimit/SetStackTraceLimit.js'
import * as Process from './parts/Process/Process.js'

const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  Process.on('uncaughtExceptionMonitor', ErrorHandling.handleUncaughtExceptionMonitor)
  // workaround for https://github.com/electron/electron/issues/36526
  Process.on('unhandledRejection', ErrorHandling.handleUnhandledRejection)
  Command.setLoad(Module.load)
  await App.hydrate()
}

main()
