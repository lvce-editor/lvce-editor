import { stat } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as DefaultUrl from '../DefaultUrl/DefaultUrl.ts'
import * as GetAppWindowOptions from '../GetAppWindowOptions/GetAppWindowOptions.ts'
import * as GetTitleBarItems from '../GetTitleBarItems/GetTitleBarItems.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as PreloadUrl from '../PreloadUrl/PreloadUrl.ts'
import * as Screen from '../Screen/Screen.ts'

const getValidatedAppUrl = (url: unknown): string => {
  if (typeof url !== 'string') {
    throw new TypeError('Expected url to be a string')
  }
  const defaultUrl = new URL(DefaultUrl.defaultUrl)
  const parsedUrl = new URL(url, defaultUrl)
  const isAppUrl =
    parsedUrl.protocol === defaultUrl.protocol &&
    parsedUrl.host === defaultUrl.host &&
    parsedUrl.username === defaultUrl.username &&
    parsedUrl.password === defaultUrl.password
  if (!isAppUrl) {
    throw new TypeError('Only application URLs can be opened in an app window')
  }
  return parsedUrl.toString()
}

const getAbsolutePath = (parsedArgs: any, workingDirectory: any): string => {
  const path = parsedArgs?._?.at(-1)
  if (!path || typeof path !== 'string') {
    return ''
  }
  if (path.startsWith('file://')) {
    return fileURLToPath(path)
  }
  return isAbsolute(path) ? path : resolve(workingDirectory, path)
}

const getAppWindowUrl = async (url: unknown, parsedArgs: any, workingDirectory: any): Promise<string> => {
  const parsedUrl = new URL(getValidatedAppUrl(url))
  const absolutePath = getAbsolutePath(parsedArgs, workingDirectory)
  if (!absolutePath) {
    return parsedUrl.toString()
  }
  const uri = pathToFileURL(absolutePath).toString()
  try {
    const stats = await stat(absolutePath)
    if (stats.isFile()) {
      parsedUrl.searchParams.set('workspace', pathToFileURL(dirname(absolutePath)).toString())
      parsedUrl.searchParams.set('openUri', uri)
      return parsedUrl.toString()
    }
  } catch {
    // Preserve the existing folder error for paths that do not exist.
  }
  parsedUrl.searchParams.set('workspace', uri)
  return parsedUrl.toString()
}

const getFloatingWindowMode = (url: string): { floatingWindowMode?: string; floatingExtensionViewId?: string } => {
  const parsedUrl = new URL(url)
  return {
    floatingExtensionViewId: parsedUrl.searchParams.get('floatingExtensionViewId') || undefined,
    floatingWindowMode: parsedUrl.searchParams.get('floatingWindowMode') || undefined,
  }
}

export const createAppWindow = async ({ parsedArgs, preferences, preloadUrl, url = DefaultUrl.defaultUrl, workingDirectory }: any): Promise<any> => {
  const validatedUrl = await getAppWindowUrl(url, parsedArgs, workingDirectory)
  const { height, width } = await Screen.getBounds()
  const { floatingExtensionViewId, floatingWindowMode } = getFloatingWindowMode(validatedUrl)
  const windowOptions = await GetAppWindowOptions.getAppWindowOptions({
    floatingExtensionViewId,
    floatingWindowMode,
    preferences,
    preloadUrl,
    screenHeight: height,
    screenWidth: width,
  })
  const titleBarItems = GetTitleBarItems.getTitleBarItems()
  return ParentIpc.invoke('AppWindow.createAppWindow', windowOptions, parsedArgs, workingDirectory, titleBarItems, validatedUrl)
}

export const openNew = async (url: any): Promise<any> => {
  const preferences = await Preferences.getAll()
  const preloadUrl = PreloadUrl.getPreloadUrl()
  return createAppWindow({ parsedArgs: [], preferences, preloadUrl, url, workingDirectory: '' })
}

export const openNewWithUri = async (uri: any): Promise<any> => {
  const url = new URL(DefaultUrl.defaultUrl)
  url.searchParams.set('openUri', uri)
  return openNew(url.toString())
}
