import * as Css from '../Css/Css.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const loadInstance = async (id, module) => {
  if (module.Css) {
    const styleSheets = Array.isArray(module.Css) ? module.Css : [module.Css]
    await Promise.all(styleSheets.map(Css.acquireCssStyleSheet))
  }
  if (module.getDynamicCss) {
    await Css.acquireDynamicCss(id, module.getDynamicCss, Preferences.state)
  }
}

export const disposeInstance = (id, module) => {
  const commands = []
  if (module.Css) {
    const styleSheets = Array.isArray(module.Css) ? module.Css : [module.Css]
    for (const styleSheet of styleSheets) {
      commands.push(...Css.releaseCssStyleSheet(styleSheet))
    }
  }
  if (module.getDynamicCss) {
    commands.push(...Css.releaseDynamicCss(id))
  }
  return commands
}

export const reloadDynamicCss = async () => {
  const seen = new Set()
  const promises = []
  for (const instance of ViewletStates.getValues()) {
    const { factory, moduleId } = instance
    if (!factory.getDynamicCss || seen.has(moduleId)) {
      continue
    }
    seen.add(moduleId)
    promises.push(Css.reloadDynamicCss(moduleId, factory.getDynamicCss, Preferences.state))
  }
  await Promise.all(promises)
}
