// @ts-ignore
performance.mark('code/start')
const Command = require('./parts/Command/Command.cjs')
const Module = require('./parts/Module/Module.cjs')
const ErrorHandling = require('./parts/ErrorHandling/ErrorHandling.cjs')
const App = require('./parts/App/App.cjs')
const SetStackTraceLimit = require('./parts/SetStackTraceLimit/SetStackTraceLimit.cjs')
const Process = require('./parts/Process/Process.cjs')

const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  Process.on('uncaughtExceptionMonitor', ErrorHandling.handleUncaughtExceptionMonitor)
  // workaround for https://github.com/electron/electron/issues/36526
  Process.on('unhandledRejection', ErrorHandling.handleUnhandledRejection)
  Command.setLoad(Module.load)
  await App.hydrate()
}

main()
