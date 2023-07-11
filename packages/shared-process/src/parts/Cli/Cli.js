import * as CliModule from '../CliModule/CliModule.js'
import * as Logger from '../Logger/Logger.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (parsedArgs) => {
  const module = await CliModule.getModule(parsedArgs)
  try {
    await module.handleCliArgs(parsedArgs._)
  } catch (error) {
    Logger.error(error)
    Process.setExitCode(1)
  }
}
