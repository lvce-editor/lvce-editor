import * as GetIconThemeJson from '../GetIconThemeJson/GetIconThemeJson.js'
import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

export const setIconTheme = async (iconThemeId) => {
  try {
    const iconTheme = await GetIconThemeJson.getIconThemeJson(iconThemeId)
    IconThemeState.state.iconTheme = iconTheme.json
    IconThemeState.state.extensionPath = iconTheme.extensionPath
    const instances = ViewletStates.getAllInstances()
    // TODO have one recalculate style and one paint
    // @ts-ignore
    for (const [key, value] of Object.entries(instances)) {
      const { factory, state } = value
      if (factory.handleIconThemeChange) {
        const newState = factory.handleIconThemeChange(state)
        await Viewlet.setState(factory.name, newState)
      }
    }
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
