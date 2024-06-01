import * as Character from '../Character/Character.js'
import * as CssState from '../CssState/CssState.js'
import * as GetCss from '../GetCss/GetCss.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

const getId = (path) => {
  return 'Css' + path.replace('/css/parts/', '').replaceAll(Character.Slash, Character.Dash).replace('.css', Character.EmptyString)
}

const actuallyLoadCssStyleSheet = async (css) => {
  try {
    const text = await GetCss.getCss(css)
    const id = getId(css)
    await addCssStyleSheet(id, text)
  } catch (error) {
    throw new VError(error, `Failed to load css "${css}"`)
  }
}

export const loadCssStyleSheet = (id) => {
  if (!CssState.has(id)) {
    CssState.set(id, actuallyLoadCssStyleSheet(id))
  }
  return CssState.get(id)
}

export const loadCssStyleSheets = (css) => {
  return Promise.all(css.map(loadCssStyleSheet))
}

export const addCssStyleSheet = (id, css) => {
  return RendererProcess.invoke('Css.addCssStyleSheet', id, css)
}

const actuallyAddDynamicCss = async (id, getCss, preferences) => {
  const css = await getCss(preferences)
  await addCssStyleSheet(id, css)
}

export const addDynamicCss = (id, getCss, preferences) => {
  if (!CssState.has(id)) {
    CssState.set(id, actuallyAddDynamicCss(id, getCss, preferences))
  }
  return CssState.get(id)
}
