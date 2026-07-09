import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as ExtensionInstall from '../ExtensionInstall/ExtensionInstall.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'

export const handleCliArgs = async (argv: any): Promise<any> => {
  try {
    const extension = argv[1]
    if (!extension) {
      Logger.error('extension argument is required')
      return
    }
    await ExtensionInstall.install(extension)
  } catch (error) {
    if (error && error.message && error.message.includes('Response code')) {
      Logger.error(error.message)
      Process.setExitCode(ExitCode.ExpectedError)
      return
    }
    if (error && error.message && error.message.includes('getaddrinfo EAI_AGAIN')) {
      Logger.error(error.message)
      Process.setExitCode(ExitCode.ExpectedError)
      return
    }
    throw error
  }
}
