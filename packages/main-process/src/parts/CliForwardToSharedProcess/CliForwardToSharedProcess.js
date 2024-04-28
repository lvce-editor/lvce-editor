import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as Exit from '../Exit/Exit.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const handleCliArgs = async (parsedArgs) => {
  try {
    await SharedProcess.invoke('HandleCliArgs.handleCliArgs', parsedArgs)
  } catch (error) {
    Process.setExitCode(ExitCode.Error)
    if (error && error instanceof Error && error.stack && error.stack.includes('shared-process')) {
      // ignore
    } else {
      ErrorHandling.handleError(error)
    }
  } finally {
    Exit.exit()
  }
}
