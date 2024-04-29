import * as Cli from '../Cli/Cli.js'
import * as Debug from '../Debug/Debug.js'
import * as HandleElectronReady from '../HandleElectronReady/HandleElectronReady.js'
import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'

export const handleSecondInstance = async (
  event,
  commandLine,
  workingDirectory,
  additionalData, // additionalData is the actual process.argv https://github.com/electron/electron/pull/30891
) => {
  Debug.debug('[info] second instance')
  const parsedArgs = ParseCliArgs.parseCliArgs(additionalData)
  Debug.debug('[info] second instance args', additionalData, parsedArgs)
  const handled = await Cli.handleFastCliArgsMaybe(parsedArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }
  await HandleElectronReady.handleReady(parsedArgs, workingDirectory)
}
