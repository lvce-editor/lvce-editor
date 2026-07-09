import * as Assert from '../Assert/Assert.ts'
import * as Cli from '../Cli/Cli.ts'
import { VError } from '../VError/VError.ts'

export const handleCliArgs = async (parsedArgs: any): Promise<any> => {
  try {
    Assert.object(parsedArgs)
    await Cli.handleCliArgs(parsedArgs)
  } catch (error) {
    throw new VError(error, `Failed to execute cli command`)
  }
}
