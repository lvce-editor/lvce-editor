import { homedir, tmpdir } from 'node:os'
import { sep } from 'node:path'
import { xdgCache, xdgConfig, xdgData, xdgState } from 'xdg-basedir'
import * as Root from '../Root/Root.js'
import * as Path from '../Path/Path.js'
import { extensionHostPath } from '@lvce-editor/extension-host'

export const state = {
  getApplicationName() {
    return 'lvce-oss'
  },
  isWindows() {
    return process.platform === 'win32'
  },
  isMacOs() {
    return process.platform === 'darwin'
  },
  getDataDir() {
    return Path.join(xdgData || tmpdir(), this.getApplicationName())
  },
  getConfigDir() {
    return Path.join(xdgConfig || tmpdir(), this.getApplicationName())
  },
  getCacheDir() {
    return Path.join(xdgCache || tmpdir(), this.getApplicationName())
  },
  getAppDir() {
    return Root.root
  },
  getExtensionsPath() {
    return Path.join(this.getDataDir(), 'extensions')
  },
  getBuiltinExtensionsPath() {
    return Path.join(Root.root, 'extensions')
  },
  getDisabledExtensionsPath() {
    return Path.join(this.getDataDir(), 'disabled-extensions')
  },
  getCachedExtensionsPath() {
    return Path.join(this.getCacheDir(), 'cached-extensions')
  },
  getMarketplaceUrl() {
    return (
      process.env.LVCE_MARKETPLACE_URL ||
      'https://marketplace.22e924c84de072d4b25b.com'
    )
  },
  getDesktop() {
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
  },
  getPathSeparator() {
    return sep
  },
  getStateDir() {
    return xdgState
  },
  getLogsDir() {
    return Path.join(xdgState || tmpdir(), this.getApplicationName(), 'logs')
  },
  getUserSettingsPath() {
    return Path.join(this.getConfigDir(), 'settings.json')
  },
  getExtensionHostPath() {
    return extensionHostPath
  },
  getRecentlyOpenedPath() {
    return Path.join(this.getCacheDir(), 'recently-opened.json')
  },
  getDefaultSettingsPath() {
    return Path.join(
      this.getAppDir(),
      'static',
      'config',
      'defaultSettings.json'
    )
  },
}

export const isWindows = () => {
  return state.isWindows()
}

export const isMacOs = () => {
  return state.isMacOs()
}

// TODO pass which version when building: insiders|oss|normal

export const getDataDir = () => {
  return state.getDataDir()
}

export const getConfigDir = () => {
  return state.getConfigDir()
}

export const getCacheDir = () => {
  return state.getCacheDir()
}

export const getHomeDir = () => {
  return isWindows() ? '' : homedir()
}

export const getAppDir = () => {
  return state.getAppDir()
}

export const getExtensionsPath = () => {
  return state.getExtensionsPath()
}

export const getBuiltinExtensionsPath = () => {
  return state.getBuiltinExtensionsPath()
}

export const getDisabledExtensionsPath = () => {
  return state.getDisabledExtensionsPath()
}

export const getCachedExtensionsPath = () => {
  return state.getCachedExtensionsPath()
}

export const getMarketplaceUrl = () => {
  return state.getMarketplaceUrl()
}

export const getDesktop = () => {
  return state.getDesktop()
}

export const getPathSeparator = () => {
  return state.getPathSeparator()
}

export const getStateDir = () => {
  return state.getStateDir()
}

export const getLogsDir = () => {
  return state.getLogsDir()
}

export const getUserSettingsPath = () => {
  return state.getUserSettingsPath()
}

export const getExtensionHostPath = () => {
  return state.getExtensionHostPath()
}

export const getRecentlyOpenedPath = () => {
  return state.getRecentlyOpenedPath()
}

export const getDefaultSettingsPath = () => {
  return state.getDefaultSettingsPath()
}
