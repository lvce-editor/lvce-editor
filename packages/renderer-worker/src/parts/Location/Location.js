import { state } from '../LocationState/LocationState.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const initialize = (href) => {
  state.href = href
}

export const getPathName = async () => {
  const pathName = await RendererProcess.invoke(/* Location.getPathName */ 'Location.getPathName')
  const { href } = state
  if (href) {
    const url = new URL(href)
    url.pathname = pathName
    state.href = url.href
  }
  return pathName
}

export const getHref = async () => {
  const href = await RendererProcess.invoke(/* Location.getHref */ 'Location.getHref')
  state.href = href
  return href
}

export const setPathName = async (pathName) => {
  const { href } = state
  if (!href) {
    return RendererProcess.invoke(/* Location.setPathName */ 'Location.setPathName', /* pathName */ pathName)
  }
  const resolvedUrl = new URL(pathName, href)
  const currentUrl = new URL(href)
  if (resolvedUrl.pathname === currentUrl.pathname) {
    return
  }
  await RendererProcess.invoke(/* Location.setPathName */ 'Location.setPathName', /* pathName */ pathName)
  state.href = resolvedUrl.href
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
