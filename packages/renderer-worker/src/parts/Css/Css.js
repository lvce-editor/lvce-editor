import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Response from '../Response/Response.js'
import { VError } from '../VError/VError.js'

export const state = {
  pending: Object.create(null),
}

export const setInlineStyle = async (id, css) => {
  await RendererProcess.invoke(/* Css.setInlineStyle */ 'Css.setInlineStyle', /* id */ id, /* css */ css)
}

const getId = (path) => {
  return 'Css' + path.replace('/css/parts/', '').replaceAll('/', '-').replace('.css', '')
}

const actuallyLoadCssStyleSheet = async (css) => {
  try {
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}${css}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const text = await Response.getText(response)
    if (Platform.isFirefox) {
      const id = getId(css)
      // workaround for broken firefox devtools when using
      // constructed style sheets
      await RendererProcess.invoke('Css.setInlineStyle', id, text)
    } else {
      await RendererProcess.invoke('Css.addCssStyleSheet', text)
    }
  } catch (error) {
    throw new VError(error, `Failed to load css "${css}"`)
  }
}

export const loadCssStyleSheet = async (css) => {
  if (!state.pending[css]) {
    state.pending[css] = actuallyLoadCssStyleSheet(css)
  }
  return state.pending[css]
}

export const loadCssStyleSheets = async (css) => {
  return Promise.all(css.map(loadCssStyleSheet))
}

const actuallyAddDynamicCss = async (getCss, preferences) => {
  const css = await getCss(preferences)
  await RendererProcess.invoke(
    /* Css.addCssStyleSheet */
    'Css.addCssStyleSheet',
    /* text */ css
  )
}

export const addDynamicCss = async (id, getCss, preferences) => {
  if (!state.pending[id]) {
    state.pending[id] = actuallyAddDynamicCss(getCss, preferences)
  }
  return state.pending[id]
}
