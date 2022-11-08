// @ts-ignore
performance.mark('code/start')
const Logging = require('./parts/Logging/Logging.js')
const App = require('./parts/App/App.js')

const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, error.stack.indexOf('\n'))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}

const handleUncaughtExceptionMonitor = (error, origin) => {
  console.info(`[main process] uncaught exception: ${firstErrorLine(error)}`)
  console.error(error)
  process.exit(1)
}

const main = () => {
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  Logging.start()
  App.hydrate()

  console.log('main started')
}

main()
