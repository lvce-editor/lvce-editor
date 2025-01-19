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
    selectedTab: '',
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
export const loadContent = async (state, savedState) => {
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state, Platform.platform, savedState)
  const dom = await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.getVirtualDom',
    newState,
    newState.sanitizedReadmeHtml,
    newState.selectedTab,
    newState,
  )
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
  await ExtensionDetailViewWorker.restart('ExtensionDetail.terminate')
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state, {})
  const dom = await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.getVirtualDom',
    newState,
    newState.sanitizedReadmeHtml,
    newState.selectedTab,
    newState,
  )
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

export const selectTab = async (state, name) => {
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.handleTabsClick', state, name)
  const dom = await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.getVirtualDom',
    newState,
    newState.sanitizedReadmeHtml,
    newState.selectedTab,
    newState,
  )

  return {
    ...newState,
    dom,
  }
}

export const handleFeaturesClick = async (state, name) => {
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.handleFeaturesClick', state, name)
  const dom = await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.getVirtualDom',
    newState,
    newState.sanitizedReadmeHtml,
    newState.selectedTab,
    newState,
  )

  return {
    ...newState,
    dom,
  }
}

export const handleClickSize = async (state) => {
  const newState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.handleClickSize', state)
  const dom = await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.getVirtualDom',
    newState,
    newState.sanitizedReadmeHtml,
    newState.selectedTab,
    newState,
  )

  return {
    ...newState,
    dom,
  }
}

export const saveState = async (state) => {
  try {
    const savedState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.saveState', state)
    return savedState
  } catch {
    return {}
  }
}

export const handleTabsClick = (state, name) => {
  return selectTab(state, name)
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
