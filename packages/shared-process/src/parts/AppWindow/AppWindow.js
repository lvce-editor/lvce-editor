import * as DefaultUrl from '../DefaultUrl/DefaultUrl.js'
import * as GetAppWindowOptions from '../GetAppWindowOptions/GetAppWindowOptions.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Screen from '../Screen/Screen.js'

export const createAppWindow = async (preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl) => {
  const screenWidth = await Screen.getWidth()
  const screenHeight = await Screen.getHeight()
  const windowOptions = GetAppWindowOptions.getAppWindowOptions(preferences, screenWidth, screenHeight)
  return ParentIpc.invoke('AppWindow.createAppWindow2', windowOptions, parsedArgs, workingDirectory, url)
}

export const openNew = async (url) => {
  const preferences = await Preferences.getAll()
  return createAppWindow(preferences, [], '', url)
}
