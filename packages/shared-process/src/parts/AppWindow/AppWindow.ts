import * as DefaultUrl from '../DefaultUrl/DefaultUrl.ts'
import * as GetAppWindowOptions from '../GetAppWindowOptions/GetAppWindowOptions.ts'
import * as GetTitleBarItems from '../GetTitleBarItems/GetTitleBarItems.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.ts'
import * as Screen from '../Screen/Screen.ts'

export const createAppWindow = async ({ preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl, preloadUrl }) => {
  const { width, height } = await Screen.getBounds()
  const windowOptions = await GetAppWindowOptions.getAppWindowOptions({
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

export const openNewWithUri = async (uri) => {
  const url = new URL(DefaultUrl.defaultUrl)
  url.searchParams.set('openUri', uri)
  return openNew(url.toString())
}
