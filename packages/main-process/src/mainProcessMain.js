// @ts-ignore
performance.mark('code/start')
const Command = require('./parts/Command/Command.js')
const Module = require('./parts/Module/Module.js')
const ErrorHandling = require('./parts/ErrorHandling/ErrorHandling.js')
const App = require('./parts/App/App.js')

const main = async () => {
  process.on(
    'uncaughtExceptionMonitor',
    ErrorHandling.handleUncaughtExceptionMonitor
  )
  // workaround for https://github.com/electron/electron/issues/36526
  process.on('unhandledRejection', ErrorHandling.handleUnhandledRejection)
  Command.setLoad(Module.load)
  await App.hydrate()

  if (Math) {
    throw new Error('oops')
  }
}

main()
