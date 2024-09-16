import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getPathName = () => {
  return RendererProcess.invoke(/* Location.getPathName */ 'Location.getPathName')
}

export const getHref = () => {
  return RendererProcess.invoke(/* Location.getHref */ 'Location.getHref')
}

export const setPathName = (pathName) => {
  return RendererProcess.invoke(/* Location.setPathName */ 'Location.setPathName', /* pathName */ pathName)
}

export const hydrate = () => {
  return RendererProcess.invoke(/* Location.hydrate */ 'Location.hydrate')
}

export const getOrigin = () => {
  return location.origin
}

export const getHost = () => {
  return location.host
}

export const getProtocol = () => {
  return location.protocol
}
