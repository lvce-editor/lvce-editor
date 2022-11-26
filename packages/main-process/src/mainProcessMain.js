// @ts-ignore
performance.mark('code/start')
const App = require('./parts/App/App.js')
const Logger = require('./parts/Logger/Logger.js')

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
  Logger.info(`[main process] uncaught exception: ${firstErrorLine(error)}`)
  Logger.error(error)
  process.exit(1)
}

const main = () => {
  process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor)
  App.hydrate()
}

main()
