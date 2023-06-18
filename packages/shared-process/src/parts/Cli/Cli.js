import * as CliModule from '../CliModule/CliModule.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (argv) => {
  const argv0 = argv[0]
  const module = await CliModule.getModule(argv0)
  try {
    await module.handleCliArgs(argv)
  } catch (error) {
    Logger.error(error)
    Process.setExitCode(1)
  }
}
