import * as CliModule from '../CliModule/CliModule.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'

export const handleCliArgs = async (parsedArgs) => {
  const module = await CliModule.getModule(parsedArgs)
  try {
    await TransientLinkedExtensions.validate()
    await module.handleCliArgs(parsedArgs._)
  } catch (error) {
    Logger.error(error)
    Process.setExitCode(1)
  }
}
