import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

export const state = {
  pending: Object.create(null),
}

export const setInlineStyle = async (id, css) => {
  await RendererProcess.invoke(/* Css.setInlineStyle */ 'Css.setInlineStyle', /* id */ id, /* css */ css)
}

const actuallyLoadCssStyleSheet = async (css) => {
  try {
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}${css}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const text = await response.text()
    await RendererProcess.invoke(
      /* Css.addCssStyleSheet */
      'Css.addCssStyleSheet',
      /* text */ text
    )
  } catch (error) {
    throw new VError(error, `Failed to load css ${css}`)
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
