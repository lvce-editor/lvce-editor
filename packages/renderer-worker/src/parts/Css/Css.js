import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'
import * as Assert from '../Assert/Assert.js'

export const setInlineStyle = async (id, css) => {
  // TODO could also import blob url style sheet, if that is faster
  await RendererProcess.invoke(
    /* Css.setInlineStyle */ 'Css.setInlineStyle',
    /* id */ id,
    /* css */ css
  )
}

export const addStyleSheet = async (url) => {
  try {
    Assert.string(url)
    await RendererProcess.invoke('Css.addStyleSheet', /* url */ url)
  } catch (error) {
    throw new VError(error, `Failed to add style sheet ${url}`)
  }
}
