import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setInlineStyle = async (id, css) => {
  await RendererProcess.invoke(
    /* Css.setInlineStyle */ 'Css.setInlineStyle',
    /* id */ id,
    /* css */ css
  )
}
