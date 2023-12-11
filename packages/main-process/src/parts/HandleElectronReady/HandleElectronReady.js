import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Preferences from '../Preferences/Preferences.js'

export const handleReady = async (parsedArgs, workingDirectory) => {
  // TODO move preferences loading and window creation to shared process
  const preferences = await Preferences.load()
  await AppWindow.createAppWindow(preferences, parsedArgs, workingDirectory)
}
