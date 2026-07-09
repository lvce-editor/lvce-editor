import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Process from '../Process/Process.ts'

export const handleDisconnect = (): any => {
  console.info('[shared process] disconnected')
  Process.exit(ExitCode.Success)
}
