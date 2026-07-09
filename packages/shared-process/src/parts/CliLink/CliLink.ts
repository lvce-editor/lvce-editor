import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as ExtensionLink from '../ExtensionLink/ExtensionLink.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'

export const handleCliArgs = async (argv: any): Promise<any> => {
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
