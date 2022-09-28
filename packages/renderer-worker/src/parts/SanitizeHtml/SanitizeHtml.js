import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const sanitizeHtml = (html) => {
  return RendererProcess.invoke('SanitizeHtml.sanitizeHtml', html)
}
