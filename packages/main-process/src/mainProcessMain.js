// @ts-ignore
performance.mark('code/start')
const Command = require('./parts/Command/Command.js')
const Module = require('./parts/Module/Module.js')
const ErrorHandling = require('./parts/ErrorHandling/ErrorHandling.js')
const App = require('./parts/App/App.js')
const SetStackTraceLimit = require('./parts/SetStackTraceLimit/SetStackTraceLimit.js')
const Process = require('./parts/Process/Process.js')

const main = async () => {
  SetStackTraceLimit.setStackTraceLimit(20)
  Process.on('uncaughtExceptionMonitor', ErrorHandling.handleUncaughtExceptionMonitor)
  // workaround for https://github.com/electron/electron/issues/36526
  Process.on('unhandledRejection', ErrorHandling.handleUnhandledRejection)
  Command.setLoad(Module.load)
  await App.hydrate()
}

main()
