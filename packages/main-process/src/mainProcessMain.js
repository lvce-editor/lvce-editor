// @ts-ignore
performance.mark('code/start')
// TODO figure out whether logging slows down startup time
require('./logging.js') // must be first import
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
  App.hydrate()
}

main()
