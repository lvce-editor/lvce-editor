import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as ExtensionLink from '../ExtensionLink/ExtensionLink.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (argv) => {
  try {
    const path = argv.length > 1 ? argv[1] : process.cwd()
    await ExtensionLink.link(path)
  } catch (error) {
    if (error && error.code === ErrorCodes.E_MANIFEST_NOT_FOUND) {
      Logger.error(error.message)
      Process.setExitCode(ExitCode.ExpectedError)
      return
    }
    throw error
  }
}
