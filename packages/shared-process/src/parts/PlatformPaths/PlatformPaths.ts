import { homedir, tmpdir } from 'node:os'
import { isAbsolute, join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { xdgCache, xdgConfig, xdgData, xdgState } from 'xdg-basedir'
import * as GetResolvedTestPath from '../GetResolvedTestPath/GetResolvedTestPath.ts'
import * as Path from '../Path/Path.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Process from '../Process/Process.ts'
import * as Root from '../Root/Root.ts'

const { env } = process

// TODO make these functions

export const dataDir = Path.join(xdgData || tmpdir(), Platform.applicationName)

export const configDir = Path.join(xdgConfig || tmpdir(), Platform.applicationName)

export const cacheDir = Path.join(xdgCache || tmpdir(), Platform.applicationName)

export const homeDir = Platform.isWindows ? '' : homedir()

export const appDir = Root.root

export const getExtensionsPath = (): any => {
  return Path.join(dataDir, 'extensions')
}

export const getBuiltinExtensionsPath = (): any => {
  return process.env.BUILTIN_EXTENSIONS_PATH || Path.join(Root.root, 'extensions')
}

export const getDisabledExtensionsJsonPath = (): any => {
  return Path.join(dataDir, 'extensions', 'disabled-extensions.json')
}

export const getDisabledExtensionsJsonUri = (): any => {
  const path = Path.join(dataDir, 'extensions', 'disabled-extensions.json')
  const uri = pathToFileURL(path).toString()
  return uri
}

/**
 * @deprecated disabled extensions are now stored in a file disabled-extensions.json
 */
export const getDisabledExtensionsPath = (): any => {
  return Path.join(dataDir, 'disabled-extensions')
}

export const getCachedExtensionsPath = (): any => {
  return Path.join(cacheDir, 'cached-extensions')
}

export const getCachedChromeExtensionsPath = (): any => {
  return Path.join(cacheDir, 'cached-electron-browser-view-chrome-extensions')
}

export const getLinkedExtensionsPath = (): any => {
  return Path.join(dataDir, 'linked-extensions')
}

export const getChromeExtensionsPath = (): any => {
  return Path.join(dataDir, 'electron-browser-view-chrome-extensions')
}

export const getMarketplaceUrl = (): any => {
  return env.LVCE_MARKETPLACE_URL || 'https://marketplace.22e924c84de072d4b25b.com'
}

export const getPathSeparator = (): any => {
  return sep
}

export const getStateDir = (): any => {
  return xdgState
}

export const getLogsDir = (): any => {
  const path = Path.join(xdgState || tmpdir(), Platform.applicationName, 'logs')
  return pathToFileURL(path).toString()
}

export const getUserSettingsPath = (): any => {
  return Path.join(configDir, 'settings.json')
}

export const getUserKeyBindingsPath = (): any => {
  return Path.join(configDir, 'keybindings.json')
}

export const getExtensionHostHelperProcessPath = async (): Promise<any> => {
  return Path.join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
}

export const getWebViewRoot = (relativePath: any): any => {
  return Path.join(Root.root, relativePath)
}

export const getRecentlyOpenedPath = (): any => {
  return Path.join(cacheDir, 'recently-opened.json')
}

export const getDefaultSettingsPath = (): any => {
  return Path.join(appDir, 'static', 'config', 'defaultSettings.json')
}

export const getTestPath = (): any => {
  const absolutePath = GetResolvedTestPath.getResolvedTestPath()
  const testPath = '/remote' + pathToFileURL(absolutePath).toString().slice(7)
  return testPath
}

export const getNodePath = (): any => {
  return Process.argv[0]
}

export const getTmpDir = (): any => {
  return tmpdir()
}

export const getOnlyExtensionPath = (): any => {
  const onlyExtensionPath = env.ONLY_EXTENSION
  if (onlyExtensionPath) {
    return resolve(onlyExtensionPath)
  }
  return ''
}

export const getAppDir = (): any => {
  return appDir
}

export const getCacheDir = (): any => {
  return cacheDir
}

export const getCacheUri = (): any => {
  return pathToFileURL(cacheDir).toString()
}

export const getConfigDir = (): any => {
  return configDir
}

export const getConfigJsonPath = (): any => {
  if (Platform.isProduction) {
    return pathToFileURL(Path.join(Root.root, 'config.json')).toString()
  }
  return pathToFileURL(Path.join(Root.root, 'static', 'config.json')).toString()
}

export const getDataDir = (): any => {
  return dataDir
}

export const getHomeDir = (): any => {
  return homeDir
}

export const getDownloadDir = (): any => {
  const { XDG_DOWNLOAD_DIR } = env
  return XDG_DOWNLOAD_DIR || join(homeDir, 'Downloads')
}

export const getRepository = (): any => {
  return `lvce-editor/lvce-editor`
}

/**
 * @deprecated use getRootUri instead
 */
export const getRoot = (): any => {
  return Root.root
}

export const getRootUri = (): any => {
  return pathToFileURL(Root.root).toString()
}
