import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Assert from '../Assert/Assert.js'
import * as Preferences from '../Preferences/Preferences.js'

export const handleElectronReady = async (parsedArgs, workingDirectory) => {
  Assert.object(parsedArgs)
  Assert.string(workingDirectory)
  const preferences = await Preferences.getAll()
  await AppWindow.createAppWindow(preferences, parsedArgs, workingDirectory)
}
