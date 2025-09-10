import { assetDir } from '../AssetDir/AssetDir.js'
import { getAllExtensions } from '../ExtensionManagement/ExtensionManagement.js'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import * as Workspace from '../Workspace/Workspace.js'

export const setIconTheme = async (iconThemeId) => {
  try {
    const extensions = await getAllExtensions()
    const iconTheme = await IconThemeWorker.invoke('IconTheme.getIconThemeJson', extensions, iconThemeId, assetDir, Platform.platform)
    if (!iconTheme) {
      return
    }
    IconThemeState.setTheme(iconTheme)
    await HandleIconThemeChange.handleIconThemeChange()
  } catch (error) {
    if (Workspace.isTest()) {
      // ignore
    } else {
      console.error(new VError(error, 'Failed to load icon theme'))
    }
  }
}

export const hydrate = async () => {
  // TODO do this all in worker
  const iconThemeId = Preferences.get('icon-theme') || 'vscode-icons'
  await setIconTheme(iconThemeId)
}

export * from '../GetIcon/GetIcon.js'
