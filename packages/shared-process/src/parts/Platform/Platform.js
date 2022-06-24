import { extensionHostPath } from '@lvce-editor/extension-host'
import { homedir, tmpdir } from 'node:os'
import { sep } from 'node:path'
import { xdgCache, xdgConfig, xdgData, xdgState } from 'xdg-basedir'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getApplicationName = () => {
  return 'lvce-oss'
}

export const isWindows = () => {
  return process.platform === 'win32'
}

export const isMacOs = () => {
  return process.platform === 'darwin'
}

// TODO pass which version when building: insiders|oss|normal

export const getDataDir = () => {
  return Path.join(xdgData || tmpdir(), getApplicationName())
}

export const getConfigDir = () => {
  return Path.join(xdgConfig || tmpdir(), getApplicationName())
}

export const getCacheDir = () => {
  return Path.join(xdgCache || tmpdir(), getApplicationName())
}

export const getHomeDir = () => {
  return isWindows() ? '' : homedir()
}

export const getAppDir = () => {
  return Root.root
}

export const getExtensionsPath = () => {
  return Path.join(getDataDir(), 'extensions')
}

export const getBuiltinExtensionsPath = () => {
  return Path.join(Root.root, 'extensions')
}

export const getDisabledExtensionsPath = () => {
  return Path.join(getDataDir(), 'disabled-extensions')
}

export const getCachedExtensionsPath = () => {
  return Path.join(getCacheDir(), 'cached-extensions')
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
  return Path.join(xdgState || tmpdir(), getApplicationName(), 'logs')
}

export const getUserSettingsPath = () => {
  return Path.join(getConfigDir(), 'settings.json')
}

export const getExtensionHostPath = () => {
  return extensionHostPath
}

export const getRecentlyOpenedPath = () => {
  return Path.join(getCacheDir(), 'recently-opened.json')
}

export const getDefaultSettingsPath = () => {
  return Path.join(getAppDir(), 'static', 'config', 'defaultSettings.json')
}
