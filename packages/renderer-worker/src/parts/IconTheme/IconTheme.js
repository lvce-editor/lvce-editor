import * as Css from '../Css/Css.js'
import * as GetIconThemeCss from '../GetIconThemeCss/GetIconThemeCss.js'
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
    const iconThemeCss = GetIconThemeCss.getIconThemeCss(iconTheme)
    const instances = ViewletStates.getAllInstances()
    // TODO have one recalculate style and one paint
    for (const [key, value] of Object.entries(instances)) {
      const { factory, state } = value
      if (factory.handleIconThemeChange) {
        const newState = factory.handleIconThemeChange(state)
        await Viewlet.setState(factory.name, newState)
      }
    }
    await Css.addCssStyleSheet('ContributedIconTheme', iconThemeCss)
  } catch (error) {
    if (Workspace.isTest()) {
      // ignore
    } else {
      console.error(new VError(error, `Failed to load icon theme`))
    }
  }
}

export const hydrate = async () => {
  // TODO icon theme css can be really large (3000+ lines)
  // and slow down recalculate style by 5x (e.g. rendering text in editor: 1.42ms normal, 7.42ms with icon theme)
  // icon theme should not slow down editor.
  // maybe set applied css only to actual used icons
  // for example, when a js file is in explorer, only generate the css for the js icon
  // that way there would be much less rules, but when a new file type appears (which should not happen often)
  // the css must be recalculated again
  // const iconThemeCss = await getIconThemeCss()

  const iconThemeId = Preferences.get('icon-theme') || 'vscode-icons'
  await setIconTheme(iconThemeId)
}
