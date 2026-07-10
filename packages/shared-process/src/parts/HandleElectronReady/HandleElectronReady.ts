import * as AppWindow from '../AppWindow/AppWindow.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.ts'
import * as Process from '../Process/Process.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'

export const handleElectronReady = async (parsedArgs: any, workingDirectory: any): Promise<any> => {
  Assert.object(parsedArgs)
  Assert.string(workingDirectory)
  try {
    await TransientLinkedExtensions.validate()
    const preferences = await Preferences.getAllSafe()
    const preloadUrl = PreloadUrl.getPreloadUrl()
    await AppWindow.createAppWindow({ parsedArgs, preferences, preloadUrl, workingDirectory })
  } catch (error) {
    Logger.error(error)
    Process.exit(ExitCode.ExpectedError)
  }
}
