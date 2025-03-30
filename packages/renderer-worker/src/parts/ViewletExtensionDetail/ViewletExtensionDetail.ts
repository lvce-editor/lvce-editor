import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as Platform from '../Platform/Platform.js'

export const create = (id: any, uri: string, x: number, y: number, width: number, height: number) => {
  return {
    name: '',
    uri,
    x,
    y,
    width,
    height,
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
    Platform.platform,
    AssetDir.assetDir,
  )
  await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent2', state.uid, savedState)
  const diffResult = await ExtensionDetailViewWorker.invoke('ExtensionDetail.diff2', state.uid)
  const commands = await ExtensionDetailViewWorker.invoke('ExtensionDetail.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
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
    Platform.platform,
    AssetDir.assetDir,
  )
  await ExtensionDetailViewWorker.invoke('ExtensionDetail.loadContent', state.uid, {})
  const diffResult = ExtensionDetailViewWorker.invoke('ExtensionDetail.diff2', state.uid)
  const commands = await ExtensionDetailViewWorker.invoke('ExtensionDetail.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}

export const saveState = async (state) => {
  const savedState = await ExtensionDetailViewWorker.invoke('ExtensionDetail.saveState', state.uid)
  return savedState
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
