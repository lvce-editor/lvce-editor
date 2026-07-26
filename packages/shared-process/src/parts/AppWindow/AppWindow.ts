import { isAbsolute, resolve } from 'node:path'
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

const getWorkspaceUri = (parsedArgs: any, workingDirectory: any): string => {
  const path = parsedArgs?._?.at(-1)
  if (!path || typeof path !== 'string') {
    return ''
  }
  if (path.startsWith('file://')) {
    return pathToFileURL(fileURLToPath(path)).toString()
  }
  const absolutePath = isAbsolute(path) ? path : resolve(workingDirectory, path)
  return pathToFileURL(absolutePath).toString()
}

const getAppWindowUrl = (url: unknown, parsedArgs: any, workingDirectory: any): string => {
  const parsedUrl = new URL(getValidatedAppUrl(url))
  const workspaceUri = getWorkspaceUri(parsedArgs, workingDirectory)
  if (workspaceUri) {
    parsedUrl.searchParams.set('workspace', workspaceUri)
  }
  return parsedUrl.toString()
}

export const createAppWindow = async ({ parsedArgs, preferences, preloadUrl, url = DefaultUrl.defaultUrl, workingDirectory }: any): Promise<any> => {
  const validatedUrl = getAppWindowUrl(url, parsedArgs, workingDirectory)
  const { height, width } = await Screen.getBounds()
  const windowOptions = await GetAppWindowOptions.getAppWindowOptions({
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
