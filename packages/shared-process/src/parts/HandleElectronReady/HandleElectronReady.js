import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Assert from '../Assert/Assert.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Logger from '../Logger/Logger.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.js'
import * as Process from '../Process/Process.js'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.js'

export const handleElectronReady = async (parsedArgs, workingDirectory) => {
  Assert.object(parsedArgs)
  Assert.string(workingDirectory)
  try {
    await TransientLinkedExtensions.validate()
    const preferences = await Preferences.getAllSafe()
    const preloadUrl = PreloadUrl.getPreloadUrl()
    await AppWindow.createAppWindow({ preferences, parsedArgs, workingDirectory, preloadUrl })
  } catch (error) {
    Logger.error(error)
    Process.exit(ExitCode.ExpectedError)
  }
}
