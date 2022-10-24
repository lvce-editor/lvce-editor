import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setInlineStyle = async (id, css) => {
  await RendererProcess.invoke(
    /* Css.setInlineStyle */ 'Css.setInlineStyle',
    /* id */ id,
    /* css */ css
  )
}

export const loadCssStyleSheet = async (css) => {
  const response = await fetch(css)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const text = await response.text()
  await RendererProcess.invoke(
    /* Css.addCssStyleSheet */
    'Css.addCssStyleSheet',
    /* text */ text
  )
}
