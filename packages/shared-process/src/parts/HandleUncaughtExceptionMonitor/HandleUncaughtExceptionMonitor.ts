import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'

const handleUncaughtExceptionMonitor = (error: any): any => {
  ErrorHandling.handleUncaughtExceptionMonitor(error, undefined)
}

export const handleUncaughtException = (error: any): any => {
  handleUncaughtExceptionMonitor(error)
  process.exit(1)
}

export const handleUnhandledRejection = (error: any): any => {
  handleUncaughtExceptionMonitor(error)
  process.exit(1)
}
