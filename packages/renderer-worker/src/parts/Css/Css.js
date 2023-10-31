import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Character from '../Character/Character.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Response from '../Response/Response.js'
import { VError } from '../VError/VError.js'

export const state = {
  pending: Object.create(null),
}

const getId = (path) => {
  return 'Css' + path.replace('/css/parts/', '').replaceAll(Character.Slash, Character.Dash).replace('.css', Character.EmptyString)
}

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
    const id = getId(css)
    await addCssStyleSheet(id, text)
  } catch (error) {
    throw new VError(error, `Failed to load css "${css}"`)
  }
}

export const loadCssStyleSheet = (css) => {
  if (!state.pending[css]) {
    state.pending[css] = actuallyLoadCssStyleSheet(css)
  }
  return state.pending[css]
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

export const addDynamicCss = async (id, getCss, preferences) => {
  if (!state.pending[id]) {
    state.pending[id] = actuallyAddDynamicCss(id, getCss, preferences)
  }
  return state.pending[id]
}
