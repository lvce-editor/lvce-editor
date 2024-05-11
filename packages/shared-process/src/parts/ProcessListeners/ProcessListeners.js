import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

export const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
  Process.exit(ExitCode.Success)
}

export const handleUncaughtExceptionMonitor = (error) => {
  ErrorHandling.handleUncaughtExceptionMonitor(error)
}
