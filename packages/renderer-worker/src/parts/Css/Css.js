import * as AssetDir from '../AssetDir/AssetDir.js'
import * as CssState from '../CssState/CssState.js'
import * as GetCssId from '../GetCssId/GetCssId.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Response from '../Response/Response.js'
import { VError } from '../VError/VError.js'

const actuallyLoadCssStyleSheet = async (css) => {
  try {
    const url = `${AssetDir.assetDir}${css}`
    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === HttpStatusCode.NotFound) {
        throw new Error(`File not found ${url}`)
      }
      throw new Error(response.statusText)
    }
    const text = await Response.getText(response)
    const id = GetCssId.getCssId(css)
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

export const reload = async (css) => {
  console.info(`[renderer-worker] reload ${css}`)
  await actuallyLoadCssStyleSheet(css)
}
