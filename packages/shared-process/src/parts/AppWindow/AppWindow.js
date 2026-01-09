import * as DefaultUrl from '../DefaultUrl/DefaultUrl.js'
import * as GetAppWindowOptions from '../GetAppWindowOptions/GetAppWindowOptions.js'
import * as GetTitleBarItems from '../GetTitleBarItems/GetTitleBarItems.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.js'
import * as Screen from '../Screen/Screen.js'

export const createAppWindow = async ({ preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl, preloadUrl }) => {
  const { width, height } = await Screen.getBounds()
  const windowOptions = GetAppWindowOptions.getAppWindowOptions({
    preferences,
    screenWidth: width,
    screenHeight: height,
    preloadUrl,
  })
  const titleBarItems = GetTitleBarItems.getTitleBarItems()
  return ParentIpc.invoke('AppWindow.createAppWindow', windowOptions, parsedArgs, workingDirectory, titleBarItems, url)
}

export const openNew = async (url) => {
  const preferences = await Preferences.getAll()
  const preloadUrl = PreloadUrl.getPreloadUrl()
  return createAppWindow({ preferences, parsedArgs: [], workingDirectory: '', url, preloadUrl })
}
