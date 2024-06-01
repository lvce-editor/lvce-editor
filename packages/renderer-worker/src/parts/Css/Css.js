import * as CssState from '../CssState/CssState.js'
import * as GetCss from '../GetCss/GetCss.js'
import * as GetCssId from '../GetCssId/GetCssId.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const actuallyLoadCssStyleSheet = async (css) => {
  const text = await GetCss.getCss(css)
  const id = GetCssId.getCssId(css)
  await addCssStyleSheet(id, text)
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

export const reload = async (css) => {
  console.info(`[renderer-worker] reload ${css}`)
  await actuallyLoadCssStyleSheet(css)
}
