import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Assert from '../Assert/Assert.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.js'

export const handleElectronReady = async (parsedArgs, workingDirectory) => {
  Assert.object(parsedArgs)
  Assert.string(workingDirectory)
  const preferences = await Preferences.getAll()
  const preloadUrl = PreloadUrl.preloadUrl
  await AppWindow.createAppWindow({ preferences, parsedArgs, workingDirectory, preloadUrl })
}
