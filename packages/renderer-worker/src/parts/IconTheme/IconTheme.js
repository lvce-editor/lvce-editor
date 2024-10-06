import * as GetIconThemeJson from '../GetIconThemeJson/GetIconThemeJson.js'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import * as Workspace from '../Workspace/Workspace.js'

export const setIconTheme = async (iconThemeId) => {
  try {
    const iconTheme = await GetIconThemeJson.getIconThemeJson(iconThemeId)
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
  const iconThemeId = Preferences.get('icon-theme') || 'vscode-icons'
  await setIconTheme(iconThemeId)
}

export * from '../GetIcon/GetIcon.js'
