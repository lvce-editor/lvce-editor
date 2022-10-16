import { extensionHostPath } from '@lvce-editor/extension-host'
import { homedir, tmpdir } from 'node:os'
import { resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { xdgCache, xdgConfig, xdgData, xdgState } from 'xdg-basedir'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const applicationName = 'lvce-oss'

export const isWindows = process.platform === 'win32'

export const isMacOs = process.platform === 'darwin'

export const dataDir = Path.join(xdgData || tmpdir(), applicationName)

export const configDir = Path.join(xdgConfig || tmpdir(), applicationName)

export const cacheDir = Path.join(xdgCache || tmpdir(), applicationName)

export const homeDir = isWindows ? '' : homedir()

export const appDir = Root.root

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
  return (
    process.env.LVCE_MARKETPLACE_URL ||
    'https://marketplace.22e924c84de072d4b25b.com'
  )
}

export const getDesktop = () => {
  if (
    process.env.ORIGINAL_XDG_CURRENT_DESKTOP &&
    process.env.ORIGINAL_XDG_CURRENT_DESKTOP !== 'undefined'
  ) {
    if (process.env.ORIGINAL_XDG_CURRENT_DESKTOP === 'ubuntu:GNOME') {
      return 'gnome'
    }
    return process.env.ORIGINAL_XDG_CURRENT_DESKTOP
  }
  if (process.env.XDG_CURRENT_DESKTOP) {
    if (process.env.XDG_CURRENT_DESKTOP === 'ubuntu:GNOME') {
      return 'gnome'
    }
    return process.env.XDG_CURRENT_DESKTOP
  }
  if (process.platform === 'win32') {
    return 'windows'
  }
  return ''
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

export const getExtensionHostPath = () => {
  return extensionHostPath
}

export const getRecentlyOpenedPath = () => {
  return Path.join(cacheDir, 'recently-opened.json')
}

export const getDefaultSettingsPath = () => {
  return Path.join(appDir, 'static', 'config', 'defaultSettings.json')
}
export const setEnvironmentVariables = (variables) => {
  for (const [key, value] of Object.entries(variables)) {
    process.env[key] = value
  }
}

export const getTestPath = () => {
  if (process.env.TEST_PATH) {
    const testPath =
      '/remote' +
      pathToFileURL(Path.join(process.cwd(), process.env.TEST_PATH))
        .toString()
        .slice(7)
    return testPath
  }
  return '/packages/extension-host-worker-tests'
}

export const getNodePath = () => {
  return process.argv[0]
}

export const getTmpDir = () => {
  return tmpdir()
}

export const getOnlyExtensionPath = () => {
  const onlyExtensionPath = process.env.ONLY_EXTENSION
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
