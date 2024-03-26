import * as Css from '../Css/Css.js'
import * as Preferences from '../Preferences/Preferences.js'

export const loadModule = async (id, module) => {
  if (module.Css) {
    // this is a memory leak but it is not too important
    // because javascript modules also cannot be unloaded
    await (Array.isArray(module.Css) ? Css.loadCssStyleSheets(module.Css) : Css.loadCssStyleSheet(module.Css))
  }
  if (module.getDynamicCss) {
    await Css.addDynamicCss(id, module.getDynamicCss, Preferences.state)
  }
}
