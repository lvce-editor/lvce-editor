import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

export const handleDisconnect = () => {
  console.info('[shared process] disconnected')
  Process.exit(ExitCode.Success)
}

export const handleSigTerm = () => {
  console.info('[shared-process] sigterm')
  Process.exit(ExitCode.Success)
}
