import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const open = (windowId, url, target, features) => {
  return RendererProcess.invoke(
    'ChildWindow.open',
    windowId,
    url,
    target,
    features
  )
}

export const postMessage = (windowId, message) => {
  return RendererProcess.invoke('ChildWindow.postMessage', windowId, message)
}
