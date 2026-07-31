import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetIconThemeEtag from '../GetIconThemeEtag/GetIconThemeEtag.js'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.js'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import * as Workspace from '../Workspace/Workspace.js'

export const getIconThemePlatform = (platform, assetDir) => {
  if (platform === PlatformType.Electron && !assetDir) {
    return PlatformType.Remote
  }
  return platform
}

export const setIconTheme = async (iconThemeId, platform, assetDir) => {
  try {
    const useCache = Preferences.get('icon-theme.cache') ?? true
    const extensions = await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', assetDir, platform)
    const iconThemePlatform = getIconThemePlatform(platform, assetDir)
    const etag = GetIconThemeEtag.getIconThemeEtag(iconThemeId)
    await IconThemeWorker.invoke('IconTheme.getIconThemeJson', extensions, iconThemeId, assetDir, iconThemePlatform, useCache, etag)
    await HandleIconThemeChange.handleIconThemeChange()
  } catch (error) {
    if (Workspace.isTest()) {
      // ignore
    } else {
      console.error(new VError(error, 'Failed to load icon theme'))
    }
  }
}

export const hydrate = async (platform, assetDir) => {
  // TODO do this all in worker
  const iconThemeId = Preferences.get('workbench.iconTheme') || 'vscode-icons'
  await setIconTheme(iconThemeId, platform, assetDir)
}

export * from '../GetIcon/GetIcon.js'
