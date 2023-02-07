import * as ExitCode from '../ExitCode/ExitCode.js'
import * as ExtensionInstall from '../ExtensionInstall/ExtensionInstall.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (argv) => {
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
