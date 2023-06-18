import * as Assert from '../Assert/Assert.js'
import * as Cli from '../Cli/Cli.js'
import { VError } from '../VError/VError.js'

export const handleCliArgs = async (argv) => {
  try {
    Assert.array(argv)
    await Cli.handleCliArgs(argv)
  } catch (error) {
    throw new VError(error, `Failed to execute cli command`)
  }
}
