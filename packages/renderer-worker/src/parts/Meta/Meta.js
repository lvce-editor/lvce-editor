import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setThemeColor = async (themeColor) => {
  await RendererProcess.invoke(
    /* Meta.setThemeColor */ 'Meta.setThemeColor',
    /* color */ themeColor
  )
}
