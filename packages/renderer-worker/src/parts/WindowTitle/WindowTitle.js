import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const set = (title) => {
  return RendererProcess.invoke('WindowTitle.set', title)
}
