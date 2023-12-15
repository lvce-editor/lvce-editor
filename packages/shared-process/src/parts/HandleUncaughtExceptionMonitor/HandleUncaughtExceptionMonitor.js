import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'

const handleUncaughtExceptionMonitor = (error) => {
  ErrorHandling.handleUncaughtExceptionMonitor(error)
}

export const handleUncaughtException = (error) => {
  handleUncaughtExceptionMonitor(error)
  process.exit(1)
}

export const handleUnhandledRejection = (error) => {
  handleUncaughtExceptionMonitor(error)
  process.exit(1)
}
