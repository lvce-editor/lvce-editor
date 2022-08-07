import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

export const setInlineStyle = async (id, css) => {
  await RendererProcess.invoke(
    /* Css.setInlineStyle */ 'Css.setInlineStyle',
    /* id */ id,
    /* css */ css
  )
}

export const addStyleSheet = async (id, url) => {
  try {
    await RendererProcess.invoke('Css.addStyleSheet', /* url */ url)
  } catch (error) {
    throw new VError(error, `Failed to add style sheet ${url}`)
  }
}
