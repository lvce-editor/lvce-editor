import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as Icon from '../Icon/Icon.js'
import * as Platform from '../Platform/Platform.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'

export const create = (id: any, uri: string, x: number, y: number, width: number, height: number) => {
  return {
    name: '',
    uri,
    x,
    y,
    width,
    height,
    size: ViewletSize.None,
  }
}

// first heading is usually extension name, since it is alreay present
// at the top, remove this heading
// const removeFirstHeading = (readme) => {
//   console.log({ readme })
//   return readme.replace(/<h1.*?>.*?<\/h1>/s, '')
// }

// TODO when there are multiple extension with the same id,
// probably need to pass extension location from extensions viewlet
export const loadContent = async (state) => {
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state, Platform.platform)
  const dom = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getVirtualDom', newState, newState.sanitizedReadmeHtml)
  return {
    ...newState,
    dom,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  await ExtensionDetailViewWorker.restart('Explorer.terminate')
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state, {})
  const dom = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getVirtualDom', newState, newState.sanitizedReadmeHtml)
  newState.isHotReloading = false
  newState.dom = dom
  return newState
}

export const handleIconError = (state) => {
  const { iconSrc } = state
  if (iconSrc === Icon.ExtensionDefaultIcon) {
    return state
  }
  return {
    ...state,
    iconSrc: Icon.ExtensionDefaultIcon,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const size = GetViewletSize.getViewletSize(dimensions.width)
  return {
    ...state,
    ...dimensions,
    size,
  }
}
