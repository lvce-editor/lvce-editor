import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.js'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import * as Workspace from '../Workspace/Workspace.js'

export const setIconTheme = async (iconThemeId) => {
  try {
    const extensions = await ExtensionHostWorker.invoke('Extensions.getExtensions')
    await IconThemeWorker.invoke('IconTheme.getIconThemeJson', extensions, iconThemeId, assetDir, Platform.platform)
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
