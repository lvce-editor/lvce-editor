import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const set = (title) => {
  return RendererProcess.invoke('WindowTitle.set', title)
}

export const setFavicon = (href) => {
  return RendererProcess.invoke('Favicon.set', href)
}
