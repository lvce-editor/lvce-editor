import * as Assert from '../Assert/Assert.js'
import * as Cli from '../Cli/Cli.js'
import { VError } from '../VError/VError.js'

export const handleCliArgs = async (parsedArgs) => {
  try {
    Assert.object(parsedArgs)
    await Cli.handleCliArgs(parsedArgs)
  } catch (error) {
    throw new VError(error, `Failed to execute cli command`)
  }
}
