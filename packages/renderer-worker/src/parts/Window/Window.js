import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setTitle = async (title) => {
  await RendererProcess.invoke(/* Window.setTitle */ 'Window.setTitle', /* title */ title)
}
