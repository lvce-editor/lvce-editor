import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

export const handleDisconnect = () => {
  console.info('[shared process] disconnected')
  Process.exit(ExitCode.Success)
}
