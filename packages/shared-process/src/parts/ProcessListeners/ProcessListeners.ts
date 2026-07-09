import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Process from '../Process/Process.ts'

export const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
  Process.exit(ExitCode.Success)
}

export const handleUncaughtExceptionMonitor = (error) => {
  ErrorHandling.handleUncaughtExceptionMonitor(error)
}
