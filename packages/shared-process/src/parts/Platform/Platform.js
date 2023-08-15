import { homedir, tmpdir } from 'node:os'
import { isAbsolute, join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { xdgCache, xdgConfig, xdgData, xdgState } from 'xdg-basedir'
import * as Path from '../Path/Path.js'
import * as Process from '../Process/Process.js'
import * as Root from '../Root/Root.js'

const { env, platform } = process

export const applicationName = 'lvce-oss'

export const isWindows = platform === 'win32'

export const isMacOs = platform === 'darwin'

export const dataDir = Path.join(xdgData || tmpdir(), applicationName)

export const configDir = Path.join(xdgConfig || tmpdir(), applicationName)

export const cacheDir = Path.join(xdgCache || tmpdir(), applicationName)

export const homeDir = isWindows ? '' : homedir()

export const appDir = Root.root

export const isAppImage = () => {
  return Boolean(env.APPIMAGE)
}

export const getExtensionsPath = () => {
  return Path.join(dataDir, 'extensions')
}

export const getBuiltinExtensionsPath = () => {
  return Path.join(Root.root, 'extensions')
}

export const getDisabledExtensionsPath = () => {
  return Path.join(dataDir, 'disabled-extensions')
}

export const getCachedExtensionsPath = () => {
  return Path.join(cacheDir, 'cached-extensions')
}

export const getCachedChromeExtensionsPath = () => {
  return Path.join(cacheDir, 'cached-electron-browser-view-chrome-extensions')
}

export const getLinkedExtensionsPath = () => {
  return Path.join(dataDir, 'linked-extensions')
}

export const getChromeExtensionsPath = () => {
  return Path.join(dataDir, 'electron-browser-view-chrome-extensions')
}

export const getMarketplaceUrl = () => {
  return env.LVCE_MARKETPLACE_URL || 'https://marketplace.22e924c84de072d4b25b.com'
}

export const getPathSeparator = () => {
  return sep
}

export const getStateDir = () => {
  return xdgState
}

export const getLogsDir = () => {
  return Path.join(xdgState || tmpdir(), applicationName, 'logs')
}

export const getUserSettingsPath = () => {
  return Path.join(configDir, 'settings.json')
}

export const getUserKeyBindingsPath = () => {
  return Path.join(configDir, 'keybindings.json')
}

export const getExtensionHostPath = async () => {
  return join(Root.root, 'packages', 'extension-host', 'src', 'extensionHostMain.js')
}

export const getExtensionHostHelperProcessPath = async () => {
  return Path.join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
}

export const getRecentlyOpenedPath = () => {
  return Path.join(cacheDir, 'recently-opened.json')
}

export const getDefaultSettingsPath = () => {
  return Path.join(appDir, 'static', 'config', 'defaultSettings.json')
}
export const setEnvironmentVariables = (variables) => {
  for (const [key, value] of Object.entries(variables)) {
    env[key] = value
  }
}

export const getTestPath = () => {
  if (env.TEST_PATH) {
    const absolutePath = isAbsolute(env.TEST_PATH) ? env.TEST_PATH : Path.join(process.cwd(), env.TEST_PATH)
    const testPath = '/remote' + pathToFileURL(absolutePath).toString().slice(7)
    return testPath
  }
  return '/packages/extension-host-worker-tests'
}

export const getNodePath = () => {
  return Process.argv[0]
}

export const getTmpDir = () => {
  return tmpdir()
}

export const getOnlyExtensionPath = () => {
  const onlyExtensionPath = env.ONLY_EXTENSION
  if (onlyExtensionPath) {
    return resolve(onlyExtensionPath)
  }
  return ''
}

export const getAppDir = () => {
  return appDir
}

export const getCacheDir = () => {
  return cacheDir
}

export const getConfigDir = () => {
  return configDir
}

export const getDataDir = () => {
  return dataDir
}

export const getHomeDir = () => {
  return homeDir
}

export const getDownloadDir = () => {
  const { XDG_DOWNLOAD_DIR } = env
  return XDG_DOWNLOAD_DIR || join(homeDir, 'Downloads')
}

export const getRepository = () => {
  return `lvce-editor/lvce-editor`
}

export const getAppImageName = () => {
  return 'Lvce'
}

export const getSetupName = () => {
  return 'Lvce-Setup'
}

export const version = '0.0.0-dev'

export const commit = 'unknown commit'

export const date = ''

export const getVersion = () => {
  return version
}

export const getCommit = () => {
  return commit
}

export const getDate = () => {
  return date
}

export const productNameLong = 'Lvce Editor - OSS'

export const getProductNameLong = () => {
  return productNameLong
}
