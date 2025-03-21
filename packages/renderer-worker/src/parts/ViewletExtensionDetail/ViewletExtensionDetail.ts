import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as Platform from '../Platform/Platform.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

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
    uid: id,
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
  await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    0,
    AssetDir.assetDir,
  )
  await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state.uid, Platform.platform, savedState)
  const dom = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getVirtualDom2', state.uid)
  return {
    ...state,
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
  await ExtensionDetailViewWorker.invoke(
    'ExtensionDetail.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    0,
    AssetDir.assetDir,
  )
  await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state.uid, {})
  const dom = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getVirtualDom2', state.uid)
  state.isHotReloading = false
  return {
    ...state,
    dom,
  }
}

export const saveState = async (state) => {
  try {
    const savedState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.saveState', state.uid)
    return savedState
  } catch {
    return {}
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
